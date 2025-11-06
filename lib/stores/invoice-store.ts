import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type InvoiceStatus = 'Borrador' | 'Enviada' | 'Pagada' | 'Vencida' | 'Cancelada'

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
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => void
  updateInvoice: (id: number, invoice: Partial<Invoice>) => void
  deleteInvoice: (id: number) => void
  getInvoicesByClient: (clientId: number) => Invoice[]
  markAsPaid: (id: number) => void
  generateInvoiceNumber: () => string
}

const initialInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-2024-001",
    clientId: 1,
    clientName: "TechCorp Solutions",
    projectId: 1,
    projectName: "E-commerce Platform",
    items: [
      {
        description: "Desarrollo Frontend - 80 horas",
        quantity: 80,
        unitPrice: 100,
        total: 8000,
      },
      {
        description: "Desarrollo Backend - 60 horas",
        quantity: 60,
        unitPrice: 120,
        total: 7200,
      },
    ],
    subtotal: 15200,
    tax: 2432,
    total: 17632,
    status: "Pagada",
    issueDate: "2024-10-01",
    dueDate: "2024-10-31",
    paidDate: "2024-10-28",
    createdAt: new Date('2024-10-01').toISOString(),
  },
  {
    id: 2,
    invoiceNumber: "INV-2024-002",
    clientId: 2,
    clientName: "StartupXYZ",
    projectId: 2,
    projectName: "Mobile App Redesign",
    items: [
      {
        description: "Diseño UX/UI",
        quantity: 1,
        unitPrice: 5000,
        total: 5000,
      },
      {
        description: "Desarrollo Mobile - 40 horas",
        quantity: 40,
        unitPrice: 110,
        total: 4400,
      },
    ],
    subtotal: 9400,
    tax: 1504,
    total: 10904,
    status: "Enviada",
    issueDate: "2024-11-01",
    dueDate: "2024-11-30",
    createdAt: new Date('2024-11-01').toISOString(),
  },
]

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: initialInvoices,

      addInvoice: (invoice) => {
        const invoiceNumber = get().generateInvoiceNumber()
        set((state) => ({
          invoices: [
            ...state.invoices,
            {
              ...invoice,
              id: Math.max(...state.invoices.map((i) => i.id), 0) + 1,
              invoiceNumber,
              createdAt: new Date().toISOString(),
            },
          ],
        }))
      },

      updateInvoice: (id, updatedInvoice) =>
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
          ),
        })),

      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        })),

      getInvoicesByClient: (clientId) => {
        return get().invoices.filter((invoice) => invoice.clientId === clientId)
      },

      markAsPaid: (id) =>
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id
              ? {
                  ...invoice,
                  status: 'Pagada' as InvoiceStatus,
                  paidDate: new Date().toISOString().split('T')[0],
                }
              : invoice
          ),
        })),

      generateInvoiceNumber: () => {
        const state = get()
        const year = new Date().getFullYear()
        const count = state.invoices.filter((inv) =>
          inv.invoiceNumber.startsWith(`INV-${year}`)
        ).length
        return `INV-${year}-${String(count + 1).padStart(3, '0')}`
      },
    }),
    {
      name: 'invoice-storage',
    }
  )
)
