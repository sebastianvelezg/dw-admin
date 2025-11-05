import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Client = {
  id: number
  name: string
  contact: string
  email: string
  phone: string
  company: string
  status: 'Activo' | 'Lead' | 'Inactivo'
  projects: number
  revenue: number
  location: string
  notes?: string
  createdAt: string
}

type ClientStore = {
  clients: Client[]
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void
  updateClient: (id: number, client: Partial<Client>) => void
  deleteClient: (id: number) => void
  getClientById: (id: number) => Client | undefined
}

const initialClients: Client[] = [
  {
    id: 1,
    name: "TechCorp Solutions",
    contact: "John Smith",
    email: "john@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    status: "Activo",
    projects: 3,
    revenue: 45000,
    location: "San Francisco, CA",
    createdAt: new Date('2023-01-15').toISOString(),
  },
  {
    id: 2,
    name: "StartupXYZ",
    contact: "Jane Doe",
    email: "jane@startupxyz.com",
    phone: "+1 (555) 234-5678",
    company: "StartupXYZ LLC",
    status: "Lead",
    projects: 1,
    revenue: 12000,
    location: "Austin, TX",
    createdAt: new Date('2023-03-20').toISOString(),
  },
  {
    id: 3,
    name: "BigCo Enterprise",
    contact: "Robert Johnson",
    email: "robert@bigco.com",
    phone: "+1 (555) 345-6789",
    company: "BigCo Corp",
    status: "Activo",
    projects: 5,
    revenue: 125000,
    location: "New York, NY",
    createdAt: new Date('2022-11-10').toISOString(),
  },
  {
    id: 4,
    name: "DevServices Pro",
    contact: "Maria Garcia",
    email: "maria@devservices.com",
    phone: "+1 (555) 456-7890",
    company: "DevServices Inc.",
    status: "Inactivo",
    projects: 0,
    revenue: 8500,
    location: "Miami, FL",
    createdAt: new Date('2023-06-05').toISOString(),
  },
  {
    id: 5,
    name: "Digital Ventures",
    contact: "Carlos Martinez",
    email: "carlos@digitalventures.com",
    phone: "+1 (555) 567-8901",
    company: "Digital Ventures Ltd",
    status: "Activo",
    projects: 2,
    revenue: 34000,
    location: "Los Angeles, CA",
    createdAt: new Date('2023-08-12').toISOString(),
  },
]

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: initialClients,

      addClient: (client) =>
        set((state) => ({
          clients: [
            ...state.clients,
            {
              ...client,
              id: Math.max(...state.clients.map((c) => c.id), 0) + 1,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateClient: (id, updatedClient) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updatedClient } : client
          ),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        })),

      getClientById: (id) => {
        return get().clients.find((client) => client.id === id)
      },
    }),
    {
      name: 'client-storage',
    }
  )
)
