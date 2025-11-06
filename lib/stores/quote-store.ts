import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  title: string
  items: QuoteItem[]
  subtotal: number
  tax: number
  total: number
  status: QuoteStatus
  issueDate: string
  validUntil: string
  acceptedDate?: string
  notes?: string
  createdAt: string
}

type QuoteStore = {
  quotes: Quote[]
  addQuote: (quote: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt'>) => void
  updateQuote: (id: number, quote: Partial<Quote>) => void
  deleteQuote: (id: number) => void
  getQuotesByClient: (clientId: number) => Quote[]
  acceptQuote: (id: number) => void
  generateQuoteNumber: () => string
}

const initialQuotes: Quote[] = [
  {
    id: 1,
    quoteNumber: "COT-2024-001",
    clientId: 3,
    clientName: "BigCo Enterprise",
    title: "Desarrollo de Portal Interno",
    items: [
      {
        description: "Diseño y arquitectura del sistema",
        quantity: 1,
        unitPrice: 8000,
        total: 8000,
      },
      {
        description: "Desarrollo completo - 200 horas",
        quantity: 200,
        unitPrice: 110,
        total: 22000,
      },
      {
        description: "Testing y QA - 40 horas",
        quantity: 40,
        unitPrice: 90,
        total: 3600,
      },
    ],
    subtotal: 33600,
    tax: 5376,
    total: 38976,
    status: "Enviada",
    issueDate: "2024-11-05",
    validUntil: "2024-12-05",
    createdAt: new Date('2024-11-05').toISOString(),
  },
  {
    id: 2,
    quoteNumber: "COT-2024-002",
    clientId: 4,
    clientName: "DevServices Pro",
    title: "Integración de APIs",
    items: [
      {
        description: "Análisis e integración de APIs",
        quantity: 80,
        unitPrice: 100,
        total: 8000,
      },
      {
        description: "Documentación técnica",
        quantity: 1,
        unitPrice: 2000,
        total: 2000,
      },
    ],
    subtotal: 10000,
    tax: 1600,
    total: 11600,
    status: "Aceptada",
    issueDate: "2024-10-20",
    validUntil: "2024-11-20",
    acceptedDate: "2024-10-25",
    createdAt: new Date('2024-10-20').toISOString(),
  },
]

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      quotes: initialQuotes,

      addQuote: (quote) => {
        const quoteNumber = get().generateQuoteNumber()
        set((state) => ({
          quotes: [
            ...state.quotes,
            {
              ...quote,
              id: Math.max(...state.quotes.map((q) => q.id), 0) + 1,
              quoteNumber,
              createdAt: new Date().toISOString(),
            },
          ],
        }))
      },

      updateQuote: (id, updatedQuote) =>
        set((state) => ({
          quotes: state.quotes.map((quote) =>
            quote.id === id ? { ...quote, ...updatedQuote } : quote
          ),
        })),

      deleteQuote: (id) =>
        set((state) => ({
          quotes: state.quotes.filter((quote) => quote.id !== id),
        })),

      getQuotesByClient: (clientId) => {
        return get().quotes.filter((quote) => quote.clientId === clientId)
      },

      acceptQuote: (id) =>
        set((state) => ({
          quotes: state.quotes.map((quote) =>
            quote.id === id
              ? {
                  ...quote,
                  status: 'Aceptada' as QuoteStatus,
                  acceptedDate: new Date().toISOString().split('T')[0],
                }
              : quote
          ),
        })),

      generateQuoteNumber: () => {
        const state = get()
        const year = new Date().getFullYear()
        const count = state.quotes.filter((q) =>
          q.quoteNumber.startsWith(`COT-${year}`)
        ).length
        return `COT-${year}-${String(count + 1).padStart(3, '0')}`
      },
    }),
    {
      name: 'quote-storage',
    }
  )
)
