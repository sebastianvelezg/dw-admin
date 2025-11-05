import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProjectStatus = 'Planeación' | 'En progreso' | 'En revisión' | 'Completado' | 'En pausa'

export type Project = {
  id: number
  title: string
  client: string
  status: ProjectStatus
  progress: number
  budget: number
  deadline: string
  team: number
  description: string
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
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    client: "TechCorp",
    status: "En progreso",
    progress: 75,
    budget: 45000,
    deadline: "2024-12-15",
    team: 4,
    description: "Plataforma completa de e-commerce con integración de pagos",
    createdAt: new Date('2023-09-01').toISOString(),
  },
  {
    id: 2,
    title: "Mobile App Redesign",
    client: "StartupXYZ",
    status: "Planeación",
    progress: 25,
    budget: 30000,
    deadline: "2024-12-30",
    team: 3,
    description: "Rediseño completo de aplicación móvil iOS y Android",
    createdAt: new Date('2023-10-10').toISOString(),
  },
  {
    id: 3,
    title: "Corporate Website",
    client: "BigCo",
    status: "Completado",
    progress: 100,
    budget: 15000,
    deadline: "2024-11-20",
    team: 2,
    description: "Sitio web corporativo con CMS",
    createdAt: new Date('2023-08-15').toISOString(),
  },
  {
    id: 4,
    title: "API Integration",
    client: "DevServices",
    status: "En progreso",
    progress: 60,
    budget: 20000,
    deadline: "2024-12-10",
    team: 5,
    description: "Integración de APIs de terceros",
    createdAt: new Date('2023-09-20').toISOString(),
  },
  {
    id: 5,
    title: "Dashboard Analytics",
    client: "Digital Ventures",
    status: "Planeación",
    progress: 15,
    budget: 35000,
    deadline: "2025-01-15",
    team: 3,
    description: "Dashboard de analytics en tiempo real",
    createdAt: new Date('2023-10-05').toISOString(),
  },
  {
    id: 6,
    title: "CRM System",
    client: "TechCorp",
    status: "En revisión",
    progress: 85,
    budget: 55000,
    deadline: "2024-11-30",
    team: 6,
    description: "Sistema CRM personalizado",
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
    }),
    {
      name: 'project-storage',
    }
  )
)
