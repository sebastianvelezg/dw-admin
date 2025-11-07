import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

export type QuoteStatus = 'Borrador' | 'Enviada' | 'Aceptada' | 'Rechazada' | 'Expirada'

export type QuoteItem = {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export type Quote = {
  id: number
  quoteNumber: string
  clientId: number
  clientName: string
  projectId?: number
  title?: string
  items: QuoteItem[]
  subtotal: number
  tax: number
  total: number
  status: QuoteStatus
  issueDate: string
  validUntil: string
  acceptedDate?: string
  rejectedDate?: string
  notes?: string
  terms?: string
  createdAt: string
}

type QuoteStore = {
  quotes: Quote[]
  loading: boolean
  initialized: boolean
  fetchQuotes: () => Promise<void>
  addQuote: (quote: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt'>) => Promise<void>
  updateQuote: (id: number, quote: Partial<Quote>) => Promise<void>
  deleteQuote: (id: number) => Promise<void>
  getQuotesByClient: (clientId: number) => Quote[]
  acceptQuote: (id: number) => Promise<void>
  rejectQuote: (id: number) => Promise<void>
  generateQuoteNumber: () => Promise<string>
}

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  quotes: [],
  loading: false,
  initialized: false,

  fetchQuotes: async () => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ quotes: [], loading: false, initialized: true })
        return
      }

      // Fetch quotes with their items
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          id,
          quote_number,
          client_id,
          client_name,
          project_id,
          title,
          issue_date,
          valid_until,
          accepted_date,
          rejected_date,
          subtotal,
          tax,
          total,
          status,
          notes,
          terms,
          created_at,
          quote_items (
            description,
            quantity,
            unit_price,
            total
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (quotesError) {
        console.error('Error fetching quotes:', quotesError)
        throw quotesError
      }

      // Map database format to Quote type
      const quotes: Quote[] = (quotesData || []).map((quote: any) => ({
        id: quote.id,
        quoteNumber: quote.quote_number,
        clientId: quote.client_id,
        clientName: quote.client_name,
        projectId: quote.project_id || undefined,
        title: quote.title || undefined,
        items: (quote.quote_items || []).map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unit_price),
          total: parseFloat(item.total),
        })),
        subtotal: parseFloat(quote.subtotal),
        tax: parseFloat(quote.tax),
        total: parseFloat(quote.total),
        status: quote.status as QuoteStatus,
        issueDate: quote.issue_date,
        validUntil: quote.valid_until,
        acceptedDate: quote.accepted_date || undefined,
        rejectedDate: quote.rejected_date || undefined,
        notes: quote.notes || undefined,
        terms: quote.terms || undefined,
        createdAt: quote.created_at,
      }))

      set({ quotes, loading: false, initialized: true })
    } catch (error: any) {
      console.error('Error fetching quotes:', error)
      set({ loading: false, initialized: true })
    }
  },

  addQuote: async (quote) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Generate quote number
      const quoteNumber = await get().generateQuoteNumber()

      // Insert quote
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert([
          {
            user_id: user.id,
            quote_number: quoteNumber,
            client_id: quote.clientId,
            client_name: quote.clientName,
            project_id: quote.projectId || null,
            title: quote.title || null,
            issue_date: quote.issueDate,
            valid_until: quote.validUntil,
            accepted_date: quote.acceptedDate || null,
            rejected_date: quote.rejectedDate || null,
            subtotal: quote.subtotal,
            tax: quote.tax,
            total: quote.total,
            status: quote.status,
            notes: quote.notes || null,
            terms: quote.terms || null,
          },
        ])
        .select()
        .single()

      if (quoteError) {
        console.error('Error adding quote:', quoteError)
        throw quoteError
      }

      // Insert quote items
      if (quote.items.length > 0) {
        const itemsToInsert = quote.items.map((item) => ({
          user_id: user.id,
          quote_id: quoteData.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total,
        }))

        const { error: itemsError } = await supabase
          .from('quote_items')
          .insert(itemsToInsert)

        if (itemsError) {
          console.error('Error adding quote items:', itemsError)
          throw itemsError
        }
      }

      // Add to local state
      const newQuote: Quote = {
        id: quoteData.id,
        quoteNumber,
        clientId: quote.clientId,
        clientName: quote.clientName,
        projectId: quote.projectId,
        title: quote.title,
        items: quote.items,
        subtotal: quote.subtotal,
        tax: quote.tax,
        total: quote.total,
        status: quote.status,
        issueDate: quote.issueDate,
        validUntil: quote.validUntil,
        acceptedDate: quote.acceptedDate,
        rejectedDate: quote.rejectedDate,
        notes: quote.notes,
        terms: quote.terms,
        createdAt: quoteData.created_at,
      }

      set((state) => ({
        quotes: [newQuote, ...state.quotes],
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error adding quote:', error)
      set({ loading: false })
      throw error
    }
  },

  updateQuote: async (id, updatedQuote) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Prepare update data
      const updateData: any = {}
      if (updatedQuote.clientId) updateData.client_id = updatedQuote.clientId
      if (updatedQuote.clientName) updateData.client_name = updatedQuote.clientName
      if (updatedQuote.projectId !== undefined) updateData.project_id = updatedQuote.projectId || null
      if (updatedQuote.title !== undefined) updateData.title = updatedQuote.title || null
      if (updatedQuote.issueDate) updateData.issue_date = updatedQuote.issueDate
      if (updatedQuote.validUntil) updateData.valid_until = updatedQuote.validUntil
      if (updatedQuote.acceptedDate !== undefined) updateData.accepted_date = updatedQuote.acceptedDate || null
      if (updatedQuote.rejectedDate !== undefined) updateData.rejected_date = updatedQuote.rejectedDate || null
      if (updatedQuote.subtotal !== undefined) updateData.subtotal = updatedQuote.subtotal
      if (updatedQuote.tax !== undefined) updateData.tax = updatedQuote.tax
      if (updatedQuote.total !== undefined) updateData.total = updatedQuote.total
      if (updatedQuote.status) updateData.status = updatedQuote.status
      if (updatedQuote.notes !== undefined) updateData.notes = updatedQuote.notes || null
      if (updatedQuote.terms !== undefined) updateData.terms = updatedQuote.terms || null

      // Update quote
      const { error: quoteError } = await supabase
        .from('quotes')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)

      if (quoteError) {
        console.error('Error updating quote:', quoteError)
        throw quoteError
      }

      // If items are being updated, delete old items and insert new ones
      if (updatedQuote.items) {
        // Delete old items
        await supabase
          .from('quote_items')
          .delete()
          .eq('quote_id', id)
          .eq('user_id', user.id)

        // Insert new items
        if (updatedQuote.items.length > 0) {
          const itemsToInsert = updatedQuote.items.map((item) => ({
            user_id: user.id,
            quote_id: id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total: item.total,
          }))

          await supabase.from('quote_items').insert(itemsToInsert)
        }
      }

      // Update local state
      set((state) => ({
        quotes: state.quotes.map((quote) =>
          quote.id === id ? { ...quote, ...updatedQuote } : quote
        ),
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error updating quote:', error)
      set({ loading: false })
      throw error
    }
  },

  deleteQuote: async (id) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Delete quote (items will be cascade deleted)
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting quote:', error)
        throw error
      }

      set((state) => ({
        quotes: state.quotes.filter((quote) => quote.id !== id),
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error deleting quote:', error)
      set({ loading: false })
      throw error
    }
  },

  getQuotesByClient: (clientId) => {
    return get().quotes.filter((quote) => quote.clientId === clientId)
  },

  acceptQuote: async (id) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const acceptedDate = new Date().toISOString().split('T')[0]

      const { error } = await supabase
        .from('quotes')
        .update({
          status: 'Aceptada',
          accepted_date: acceptedDate,
        })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error accepting quote:', error)
        throw error
      }

      set((state) => ({
        quotes: state.quotes.map((quote) =>
          quote.id === id
            ? {
                ...quote,
                status: 'Aceptada' as QuoteStatus,
                acceptedDate,
              }
            : quote
        ),
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error accepting quote:', error)
      set({ loading: false })
      throw error
    }
  },

  rejectQuote: async (id) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const rejectedDate = new Date().toISOString().split('T')[0]

      const { error } = await supabase
        .from('quotes')
        .update({
          status: 'Rechazada',
          rejected_date: rejectedDate,
        })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error rejecting quote:', error)
        throw error
      }

      set((state) => ({
        quotes: state.quotes.map((quote) =>
          quote.id === id
            ? {
                ...quote,
                status: 'Rechazada' as QuoteStatus,
                rejectedDate,
              }
            : quote
        ),
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error rejecting quote:', error)
      set({ loading: false })
      throw error
    }
  },

  generateQuoteNumber: async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const year = new Date().getFullYear()

      // Get count of quotes for this year
      const { data, error } = await supabase
        .from('quotes')
        .select('quote_number')
        .eq('user_id', user.id)
        .like('quote_number', `COT-${year}-%`)

      if (error) {
        console.error('Error generating quote number:', error)
        throw error
      }

      const count = (data || []).length
      return `COT-${year}-${String(count + 1).padStart(3, '0')}`
    } catch (error: any) {
      console.error('Error generating quote number:', error)
      // Fallback to timestamp-based number
      return `COT-${new Date().getFullYear()}-${Date.now()}`
    }
  },
}))
