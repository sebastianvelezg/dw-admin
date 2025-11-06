import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

export type InvoiceStatus = 'Borrador' | 'Enviada' | 'Pendiente' | 'Pagada' | 'Vencida' | 'Cancelada'

export type InvoiceItem = {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export type Invoice = {
  id: number
  invoiceNumber: string
  clientId: number
  clientName: string
  projectId?: number
  projectName?: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  paidDate?: string
  notes?: string
  createdAt: string
}

type InvoiceStore = {
  invoices: Invoice[]
  loading: boolean
  initialized: boolean
  fetchInvoices: () => Promise<void>
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => Promise<void>
  updateInvoice: (id: number, invoice: Partial<Invoice>) => Promise<void>
  deleteInvoice: (id: number) => Promise<void>
  getInvoicesByClient: (clientId: number) => Invoice[]
  markAsPaid: (id: number) => Promise<void>
  generateInvoiceNumber: () => Promise<string>
}

const supabase = createClient()

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  loading: false,
  initialized: false,

  fetchInvoices: async () => {
    try {
      set({ loading: true })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ invoices: [], loading: false, initialized: true })
        return
      }

      // Fetch invoices with their items
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          client_id,
          client_name,
          project_id,
          issue_date,
          due_date,
          paid_date,
          subtotal,
          tax,
          total,
          status,
          notes,
          created_at,
          invoice_items (
            description,
            quantity,
            unit_price,
            total
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (invoicesError) throw invoicesError

      // Map database format to Invoice type
      const invoices: Invoice[] = (invoicesData || []).map((invoice: any) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        clientId: invoice.client_id,
        clientName: invoice.client_name,
        projectId: invoice.project_id || undefined,
        projectName: undefined, // TODO: Join with projects table if needed
        items: (invoice.invoice_items || []).map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          total: item.total,
        })),
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        total: invoice.total,
        status: invoice.status as InvoiceStatus,
        issueDate: invoice.issue_date,
        dueDate: invoice.due_date,
        paidDate: invoice.paid_date || undefined,
        notes: invoice.notes || undefined,
        createdAt: invoice.created_at,
      }))

      set({ invoices, loading: false, initialized: true })
    } catch (error) {
      console.error('Error fetching invoices:', error)
      set({ loading: false, initialized: true })
    }
  },

  addInvoice: async (invoice) => {
    try {
      set({ loading: true })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Generate invoice number
      const invoiceNumber = await get().generateInvoiceNumber()

      // Insert invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert([
          {
            user_id: user.id,
            invoice_number: invoiceNumber,
            client_id: invoice.clientId,
            client_name: invoice.clientName,
            project_id: invoice.projectId || null,
            issue_date: invoice.issueDate,
            due_date: invoice.dueDate,
            paid_date: invoice.paidDate || null,
            subtotal: invoice.subtotal,
            tax: invoice.tax,
            total: invoice.total,
            status: invoice.status,
            notes: invoice.notes || null,
          },
        ])
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Insert invoice items
      const itemsToInsert = invoice.items.map((item) => ({
        user_id: user.id,
        invoice_id: invoiceData.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total: item.total,
      }))

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      // Add to local state
      const newInvoice: Invoice = {
        id: invoiceData.id,
        invoiceNumber,
        clientId: invoice.clientId,
        clientName: invoice.clientName,
        projectId: invoice.projectId,
        projectName: invoice.projectName,
        items: invoice.items,
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        total: invoice.total,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        notes: invoice.notes,
        createdAt: invoiceData.created_at,
      }

      set((state) => ({
        invoices: [newInvoice, ...state.invoices],
        loading: false,
      }))
    } catch (error) {
      console.error('Error adding invoice:', error)
      set({ loading: false })
      throw error
    }
  },

  updateInvoice: async (id, updatedInvoice) => {
    try {
      set({ loading: true })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Prepare update data
      const updateData: any = {}
      if (updatedInvoice.clientId) updateData.client_id = updatedInvoice.clientId
      if (updatedInvoice.clientName) updateData.client_name = updatedInvoice.clientName
      if (updatedInvoice.projectId !== undefined) updateData.project_id = updatedInvoice.projectId || null
      if (updatedInvoice.issueDate) updateData.issue_date = updatedInvoice.issueDate
      if (updatedInvoice.dueDate) updateData.due_date = updatedInvoice.dueDate
      if (updatedInvoice.paidDate !== undefined) updateData.paid_date = updatedInvoice.paidDate || null
      if (updatedInvoice.subtotal !== undefined) updateData.subtotal = updatedInvoice.subtotal
      if (updatedInvoice.tax !== undefined) updateData.tax = updatedInvoice.tax
      if (updatedInvoice.total !== undefined) updateData.total = updatedInvoice.total
      if (updatedInvoice.status) updateData.status = updatedInvoice.status
      if (updatedInvoice.notes !== undefined) updateData.notes = updatedInvoice.notes || null

      // Update invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // If items are being updated, delete old items and insert new ones
      if (updatedInvoice.items) {
        // Delete old items
        const { error: deleteError } = await supabase
          .from('invoice_items')
          .delete()
          .eq('invoice_id', id)
          .eq('user_id', user.id)

        if (deleteError) throw deleteError

        // Insert new items
        const itemsToInsert = updatedInvoice.items.map((item) => ({
          user_id: user.id,
          invoice_id: id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total,
        }))

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(itemsToInsert)

        if (itemsError) throw itemsError
      }

      // Update local state
      set((state) => ({
        invoices: state.invoices.map((invoice) =>
          invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
        ),
        loading: false,
      }))
    } catch (error) {
      console.error('Error updating invoice:', error)
      set({ loading: false })
      throw error
    }
  },

  deleteInvoice: async (id) => {
    try {
      set({ loading: true })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Delete invoice (items will be cascade deleted)
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      set((state) => ({
        invoices: state.invoices.filter((invoice) => invoice.id !== id),
        loading: false,
      }))
    } catch (error) {
      console.error('Error deleting invoice:', error)
      set({ loading: false })
      throw error
    }
  },

  getInvoicesByClient: (clientId) => {
    return get().invoices.filter((invoice) => invoice.clientId === clientId)
  },

  markAsPaid: async (id) => {
    try {
      set({ loading: true })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const paidDate = new Date().toISOString().split('T')[0]

      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'Pagada',
          paid_date: paidDate,
        })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      set((state) => ({
        invoices: state.invoices.map((invoice) =>
          invoice.id === id
            ? {
                ...invoice,
                status: 'Pagada' as InvoiceStatus,
                paidDate,
              }
            : invoice
        ),
        loading: false,
      }))
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
      set({ loading: false })
      throw error
    }
  },

  generateInvoiceNumber: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const year = new Date().getFullYear()

      // Get count of invoices for this year
      const { data, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .eq('user_id', user.id)
        .like('invoice_number', `INV-${year}-%`)

      if (error) throw error

      const count = (data || []).length
      return `INV-${year}-${String(count + 1).padStart(3, '0')}`
    } catch (error) {
      console.error('Error generating invoice number:', error)
      // Fallback to timestamp-based number
      return `INV-${new Date().getFullYear()}-${Date.now()}`
    }
  },
}))
