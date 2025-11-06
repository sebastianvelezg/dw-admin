import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProjectLink = {
  id: number
  projectId: number
  title: string
  url: string
  type: 'Repositorio' | 'Documentación' | 'Demo' | 'Diseño' | 'Otro'
  description?: string
  createdAt: string
}

type LinkStore = {
  links: ProjectLink[]
  addLink: (link: Omit<ProjectLink, 'id' | 'createdAt'>) => void
  updateLink: (id: number, link: Partial<ProjectLink>) => void
  deleteLink: (id: number) => void
  getLinksByProject: (projectId: number) => ProjectLink[]
}

const initialLinks: ProjectLink[] = [
  {
    id: 1,
    projectId: 1,
    title: "GitHub Repository",
    url: "https://github.com/techcorp/ecommerce",
    type: "Repositorio",
    description: "Código fuente del proyecto",
    createdAt: new Date('2023-09-01').toISOString(),
  },
  {
    id: 2,
    projectId: 1,
    title: "Figma Designs",
    url: "https://figma.com/file/abc123",
    type: "Diseño",
    description: "Diseños y prototipos",
    createdAt: new Date('2023-09-05').toISOString(),
  },
  {
    id: 3,
    projectId: 1,
    title: "Staging Demo",
    url: "https://staging.techcorp-ecommerce.com",
    type: "Demo",
    description: "Versión de pruebas",
    createdAt: new Date('2023-10-20').toISOString(),
  },
]

export const useLinkStore = create<LinkStore>()(
  persist(
    (set, get) => ({
      links: initialLinks,

      addLink: (link) =>
        set((state) => ({
          links: [
            ...state.links,
            {
              ...link,
              id: Math.max(...state.links.map((l) => l.id), 0) + 1,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateLink: (id, updatedLink) =>
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, ...updatedLink } : link
          ),
        })),

      deleteLink: (id) =>
        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        })),

      getLinksByProject: (projectId) => {
        return get().links.filter((link) => link.projectId === projectId)
      },
    }),
    {
      name: 'link-storage',
    }
  )
)
