import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProjectStatus = 'Planeación' | 'En progreso' | 'En revisión' | 'Completado' | 'En pausa'

export type PaymentMilestone = {
  id: number
  name: string
  percentage: number
  amount: number
  status: 'Pendiente' | 'Pagada' | 'Vencida'
  dueDate?: string
  paidDate?: string
  invoiceId?: number
  description?: string
}

export type TeamMember = {
  id: number
  name: string
  role: string
  avatar?: string
}

export type Project = {
  id: number
  title: string
  client: string
  clientId: number
  status: ProjectStatus
  progress: number
  budget: number
  spent: number
  deadline: string
  startDate: string
  team: number
  teamMembers: TeamMember[]
  description: string
  paymentMilestones: PaymentMilestone[]
  totalPaid: number
  category?: string
  priority?: 'Baja' | 'Media' | 'Alta'
  createdAt: string
}

type ProjectStore = {
  projects: Project[]
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void
  updateProject: (id: number, project: Partial<Project>) => void
  deleteProject: (id: number) => void
  updateProjectStatus: (id: number, status: ProjectStatus) => void
  getProjectById: (id: number) => Project | undefined
  getProjectsByStatus: (status: ProjectStatus) => Project[]
  updatePaymentMilestone: (projectId: number, milestoneId: number, updates: Partial<PaymentMilestone>) => void
  markMilestoneAsPaid: (projectId: number, milestoneId: number, paidDate: string, invoiceId?: number) => void
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    client: "TechCorp Solutions",
    clientId: 1,
    status: "En progreso",
    progress: 75,
    budget: 45000,
    spent: 33750,
    deadline: "2024-12-15",
    startDate: "2023-09-01",
    team: 4,
    teamMembers: [
      { id: 1, name: "María García", role: "Frontend Lead" },
      { id: 2, name: "Juan Pérez", role: "Backend Developer" },
      { id: 3, name: "Laura Torres", role: "QA Engineer" },
      { id: 4, name: "Carlos Ruiz", role: "UI/UX Designer" },
    ],
    description: "Plataforma completa de e-commerce con integración de pagos",
    paymentMilestones: [
      {
        id: 1,
        name: "Pago Inicial",
        percentage: 30,
        amount: 13500,
        status: "Pagada",
        dueDate: "2023-09-15",
        paidDate: "2023-09-12",
        invoiceId: 1,
        description: "30% al inicio del proyecto",
      },
      {
        id: 2,
        name: "Entrega MVP",
        percentage: 40,
        amount: 18000,
        status: "Pagada",
        dueDate: "2023-11-01",
        paidDate: "2023-10-28",
        description: "40% al entregar el MVP funcional",
      },
      {
        id: 3,
        name: "Entrega Final",
        percentage: 30,
        amount: 13500,
        status: "Pendiente",
        dueDate: "2024-12-20",
        description: "30% al completar el proyecto",
      },
    ],
    totalPaid: 31500,
    category: "Desarrollo Web",
    priority: "Alta",
    createdAt: new Date('2023-09-01').toISOString(),
  },
  {
    id: 2,
    title: "Mobile App Redesign",
    client: "StartupXYZ",
    clientId: 2,
    status: "Planeación",
    progress: 25,
    budget: 30000,
    spent: 7500,
    deadline: "2024-12-30",
    startDate: "2023-10-10",
    team: 3,
    teamMembers: [
      { id: 5, name: "Ana Martínez", role: "Mobile Developer" },
      { id: 6, name: "Pedro López", role: "UI Designer" },
      { id: 7, name: "Sofia Hernández", role: "Project Manager" },
    ],
    description: "Rediseño completo de aplicación móvil iOS y Android",
    paymentMilestones: [
      {
        id: 1,
        name: "Anticipo",
        percentage: 50,
        amount: 15000,
        status: "Pagada",
        dueDate: "2023-10-20",
        paidDate: "2023-10-18",
        description: "50% de anticipo",
      },
      {
        id: 2,
        name: "Entrega Final",
        percentage: 50,
        amount: 15000,
        status: "Pendiente",
        dueDate: "2024-12-30",
        description: "50% al finalizar",
      },
    ],
    totalPaid: 15000,
    category: "Desarrollo Móvil",
    priority: "Media",
    createdAt: new Date('2023-10-10').toISOString(),
  },
  {
    id: 3,
    title: "Corporate Website",
    client: "BigCo Enterprise",
    clientId: 3,
    status: "Completado",
    progress: 100,
    budget: 15000,
    spent: 15000,
    deadline: "2024-11-20",
    startDate: "2023-08-15",
    team: 2,
    teamMembers: [
      { id: 8, name: "Roberto Díaz", role: "Full Stack Developer" },
      { id: 9, name: "Carmen Vega", role: "Content Manager" },
    ],
    description: "Sitio web corporativo con CMS",
    paymentMilestones: [
      {
        id: 1,
        name: "Pago Único",
        percentage: 100,
        amount: 15000,
        status: "Pagada",
        dueDate: "2024-11-20",
        paidDate: "2024-11-18",
        description: "Pago completo al finalizar",
      },
    ],
    totalPaid: 15000,
    category: "Desarrollo Web",
    priority: "Baja",
    createdAt: new Date('2023-08-15').toISOString(),
  },
  {
    id: 4,
    title: "API Integration",
    client: "DevServices Pro",
    clientId: 4,
    status: "En progreso",
    progress: 60,
    budget: 20000,
    spent: 12000,
    deadline: "2024-12-10",
    startDate: "2023-09-20",
    team: 5,
    teamMembers: [
      { id: 10, name: "Miguel Ángel", role: "Backend Lead" },
      { id: 11, name: "Isabel Castro", role: "DevOps" },
      { id: 12, name: "Fernando Ramos", role: "API Specialist" },
      { id: 13, name: "Lucía Morales", role: "QA" },
      { id: 14, name: "Diego Santos", role: "Documentation" },
    ],
    description: "Integración de APIs de terceros",
    paymentMilestones: [
      {
        id: 1,
        name: "Fase 1",
        percentage: 30,
        amount: 6000,
        status: "Pagada",
        dueDate: "2023-10-15",
        paidDate: "2023-10-12",
        description: "30% primera fase",
      },
      {
        id: 2,
        name: "Fase 2",
        percentage: 30,
        amount: 6000,
        status: "Pagada",
        dueDate: "2024-11-01",
        paidDate: "2024-10-30",
        description: "30% segunda fase",
      },
      {
        id: 3,
        name: "Fase 3",
        percentage: 40,
        amount: 8000,
        status: "Pendiente",
        dueDate: "2024-12-10",
        description: "40% fase final",
      },
    ],
    totalPaid: 12000,
    category: "Integración",
    priority: "Alta",
    createdAt: new Date('2023-09-20').toISOString(),
  },
  {
    id: 5,
    title: "Dashboard Analytics",
    client: "Digital Ventures",
    clientId: 5,
    status: "Planeación",
    progress: 15,
    budget: 35000,
    spent: 5250,
    deadline: "2025-01-15",
    startDate: "2023-10-05",
    team: 3,
    teamMembers: [
      { id: 15, name: "Patricia Gil", role: "Data Engineer" },
      { id: 16, name: "Javier Ortiz", role: "Frontend Developer" },
      { id: 17, name: "Raquel Mendoza", role: "UX Designer" },
    ],
    description: "Dashboard de analytics en tiempo real",
    paymentMilestones: [
      {
        id: 1,
        name: "Pago Inicial",
        percentage: 25,
        amount: 8750,
        status: "Pendiente",
        dueDate: "2023-10-20",
        description: "25% inicial",
      },
      {
        id: 2,
        name: "Desarrollo Backend",
        percentage: 35,
        amount: 12250,
        status: "Pendiente",
        dueDate: "2024-11-15",
        description: "35% backend completo",
      },
      {
        id: 3,
        name: "Desarrollo Frontend",
        percentage: 25,
        amount: 8750,
        status: "Pendiente",
        dueDate: "2024-12-20",
        description: "25% frontend completo",
      },
      {
        id: 4,
        name: "Entrega Final",
        percentage: 15,
        amount: 5250,
        status: "Pendiente",
        dueDate: "2025-01-15",
        description: "15% entrega final",
      },
    ],
    totalPaid: 0,
    category: "Data Analytics",
    priority: "Media",
    createdAt: new Date('2023-10-05').toISOString(),
  },
  {
    id: 6,
    title: "CRM System",
    client: "TechCorp Solutions",
    clientId: 1,
    status: "En revisión",
    progress: 85,
    budget: 55000,
    spent: 46750,
    deadline: "2024-11-30",
    startDate: "2023-07-01",
    team: 6,
    teamMembers: [
      { id: 18, name: "Alberto Sánchez", role: "Tech Lead" },
      { id: 19, name: "Mónica Reyes", role: "Backend Developer" },
      { id: 20, name: "Sergio Vargas", role: "Frontend Developer" },
      { id: 21, name: "Natalia Cruz", role: "UX/UI Designer" },
      { id: 22, name: "Tomás Flores", role: "QA Lead" },
      { id: 23, name: "Elena Romero", role: "Scrum Master" },
    ],
    description: "Sistema CRM personalizado",
    paymentMilestones: [
      {
        id: 1,
        name: "Inicio",
        percentage: 20,
        amount: 11000,
        status: "Pagada",
        dueDate: "2023-07-15",
        paidDate: "2023-07-10",
        description: "20% inicio",
      },
      {
        id: 2,
        name: "Sprint 1-3",
        percentage: 30,
        amount: 16500,
        status: "Pagada",
        dueDate: "2023-09-30",
        paidDate: "2023-09-28",
        description: "30% primeros sprints",
      },
      {
        id: 3,
        name: "Sprint 4-6",
        percentage: 30,
        amount: 16500,
        status: "Pagada",
        dueDate: "2024-11-15",
        paidDate: "2024-11-14",
        description: "30% sprints intermedios",
      },
      {
        id: 4,
        name: "Entrega Final",
        percentage: 20,
        amount: 11000,
        status: "Pendiente",
        dueDate: "2024-12-05",
        description: "20% entrega final",
      },
    ],
    totalPaid: 44000,
    category: "Sistema Empresarial",
    priority: "Alta",
    createdAt: new Date('2023-07-01').toISOString(),
  },
]

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: initialProjects,

      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: Math.max(...state.projects.map((p) => p.id), 0) + 1,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updatedProject } : project
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),

      updateProjectStatus: (id, status) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, status } : project
          ),
        })),

      getProjectById: (id) => {
        return get().projects.find((project) => project.id === id)
      },

      getProjectsByStatus: (status) => {
        return get().projects.filter((project) => project.status === status)
      },

      updatePaymentMilestone: (projectId, milestoneId, updates) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  paymentMilestones: project.paymentMilestones.map((milestone) =>
                    milestone.id === milestoneId
                      ? { ...milestone, ...updates }
                      : milestone
                  ),
                }
              : project
          ),
        })),

      markMilestoneAsPaid: (projectId, milestoneId, paidDate, invoiceId) =>
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id === projectId) {
              const updatedMilestones = project.paymentMilestones.map((milestone) =>
                milestone.id === milestoneId
                  ? {
                      ...milestone,
                      status: 'Pagada' as const,
                      paidDate,
                      invoiceId,
                    }
                  : milestone
              )
              const newTotalPaid = updatedMilestones
                .filter((m) => m.status === 'Pagada')
                .reduce((sum, m) => sum + m.amount, 0)

              return {
                ...project,
                paymentMilestones: updatedMilestones,
                totalPaid: newTotalPaid,
              }
            }
            return project
          }),
        })),
    }),
    {
      name: 'project-storage',
    }
  )
)
