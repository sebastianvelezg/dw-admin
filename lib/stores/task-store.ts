import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Task = {
  id: number
  projectId: number
  title: string
  description: string
  status: 'Todo' | 'En progreso' | 'Completado'
  priority: 'Baja' | 'Media' | 'Alta'
  assignedTo?: string
  dueDate: string
  createdAt: string
  completedAt?: string
}

type TaskStore = {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: number, task: Partial<Task>) => void
  deleteTask: (id: number) => void
  getTasksByProject: (projectId: number) => Task[]
  toggleTaskStatus: (id: number) => void
}

const initialTasks: Task[] = [
  {
    id: 1,
    projectId: 1,
    title: "Diseñar interfaz de usuario",
    description: "Crear mockups y prototipos de la plataforma",
    status: "Completado",
    priority: "Alta",
    assignedTo: "María García",
    dueDate: "2024-11-10",
    createdAt: new Date('2023-09-05').toISOString(),
    completedAt: new Date('2023-11-08').toISOString(),
  },
  {
    id: 2,
    projectId: 1,
    title: "Implementar sistema de pagos",
    description: "Integrar Stripe para procesamiento de pagos",
    status: "En progreso",
    priority: "Alta",
    assignedTo: "Juan Pérez",
    dueDate: "2024-11-25",
    createdAt: new Date('2023-10-01').toISOString(),
  },
  {
    id: 3,
    projectId: 1,
    title: "Testing de seguridad",
    description: "Realizar pruebas de penetración",
    status: "Todo",
    priority: "Media",
    assignedTo: "Laura Torres",
    dueDate: "2024-12-01",
    createdAt: new Date('2023-10-15').toISOString(),
  },
]

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.max(...state.tasks.map((t) => t.id), 0) + 1,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      getTasksByProject: (projectId) => {
        return get().tasks.filter((task) => task.projectId === projectId)
      },

      toggleTaskStatus: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: task.status === 'Completado' ? 'Todo' : 'Completado',
                  completedAt:
                    task.status === 'Completado'
                      ? undefined
                      : new Date().toISOString(),
                }
              : task
          ),
        })),
    }),
    {
      name: 'task-storage',
    }
  )
)
