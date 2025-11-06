import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

export type Client = {
  id: number
  name: string
  contact: string
  email: string
  phone: string
  company: string
  status: 'Activo' | 'Inactivo' | 'Prospecto'
  projects: number
  revenue: number
  location: string
  notes?: string
  createdAt: string
}

type ClientStore = {
  clients: Client[]
  loading: boolean
  initialized: boolean
  fetchClients: () => Promise<void>
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'projects' | 'revenue'>) => Promise<void>
  updateClient: (id: number, client: Partial<Client>) => Promise<void>
  deleteClient: (id: number) => Promise<void>
  getClientById: (id: number) => Client | undefined
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  loading: false,
  initialized: false,

  fetchClients: async () => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ clients: [], loading: false, initialized: true })
        return
      }

      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, name, email, phone, company, address, city, country, status, notes, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (clientsError) {
        console.error('Error fetching clients:', {
          message: clientsError.message,
          details: clientsError.details,
          hint: clientsError.hint,
          code: clientsError.code
        })
        throw clientsError
      }

      // Fetch project counts for each client
      const { data: projectCounts, error: projectError } = await supabase
        .from('projects')
        .select('client_id')
        .eq('user_id', user.id)

      if (projectError) {
        console.error('Error fetching project counts:', {
          message: projectError.message,
          details: projectError.details,
          hint: projectError.hint,
          code: projectError.code
        })
      }

      // Create a map of client_id to project count
      const projectCountMap = new Map<number, number>()
      if (projectCounts) {
        projectCounts.forEach((project: any) => {
          const count = projectCountMap.get(project.client_id) || 0
          projectCountMap.set(project.client_id, count + 1)
        })
      }

      // Map database fields to Client type
      const clients: Client[] = (clientsData || []).map((client: any) => ({
        id: client.id,
        name: client.name,
        contact: client.name, // Using name as contact for now
        email: client.email,
        phone: client.phone || '',
        company: client.company || '',
        status: client.status as 'Activo' | 'Inactivo' | 'Prospecto',
        projects: projectCountMap.get(client.id) || 0,
        revenue: 0, // Will be calculated from projects
        location: client.city && client.country ? `${client.city}, ${client.country}` : client.city || client.country || '',
        notes: client.notes || '',
        createdAt: client.created_at
      }))

      set({ clients, loading: false, initialized: true })
    } catch (error: any) {
      console.error('Error fetching clients:', {
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack
      })
      set({ loading: false, initialized: true })
    }
  },

  addClient: async (client) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Split location into city and country
      const [city, country] = client.location?.split(',').map(s => s.trim()) || ['', '']

      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            user_id: user.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            company: client.company,
            city: city,
            country: country,
            status: client.status,
            notes: client.notes || null,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error adding client:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      // Add to local state
      const newClient: Client = {
        id: data.id,
        name: data.name,
        contact: data.name,
        email: data.email,
        phone: data.phone || '',
        company: data.company || '',
        status: data.status as 'Activo' | 'Inactivo' | 'Prospecto',
        projects: 0,
        revenue: 0,
        location: data.city && data.country ? `${data.city}, ${data.country}` : data.city || data.country || '',
        notes: data.notes || '',
        createdAt: data.created_at
      }

      set((state) => ({
        clients: [newClient, ...state.clients],
        loading: false
      }))
    } catch (error: any) {
      console.error('Error adding client:', {
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack
      })
      set({ loading: false })
      throw error
    }
  },

  updateClient: async (id, updatedClient) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Split location if provided
      let updateData: any = {}

      if (updatedClient.name) updateData.name = updatedClient.name
      if (updatedClient.email) updateData.email = updatedClient.email
      if (updatedClient.phone !== undefined) updateData.phone = updatedClient.phone
      if (updatedClient.company !== undefined) updateData.company = updatedClient.company
      if (updatedClient.status) updateData.status = updatedClient.status
      if (updatedClient.notes !== undefined) updateData.notes = updatedClient.notes

      if (updatedClient.location) {
        const [city, country] = updatedClient.location.split(',').map(s => s.trim())
        updateData.city = city
        updateData.country = country
      }

      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating client:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      // Update local state
      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === id
            ? {
                ...client,
                name: data.name,
                contact: data.name,
                email: data.email,
                phone: data.phone || '',
                company: data.company || '',
                status: data.status,
                location: data.city && data.country ? `${data.city}, ${data.country}` : data.city || data.country || '',
                notes: data.notes || '',
              }
            : client
        ),
        loading: false
      }))
    } catch (error: any) {
      console.error('Error updating client:', {
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack
      })
      set({ loading: false })
      throw error
    }
  },

  deleteClient: async (id) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting client:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      set((state) => ({
        clients: state.clients.filter((client) => client.id !== id),
        loading: false
      }))
    } catch (error: any) {
      console.error('Error deleting client:', {
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack
      })
      set({ loading: false })
      throw error
    }
  },

  getClientById: (id) => {
    return get().clients.find((client) => client.id === id)
  },
}))
