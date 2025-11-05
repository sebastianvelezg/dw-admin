import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Employee = {
  id: number
  name: string
  role: string
  department: string
  email: string
  phone: string
  location: string
  status: 'Activo' | 'Vacaciones' | 'Inactivo'
  projects: number
  joinDate: string
  notes?: string
}

type EmployeeStore = {
  employees: Employee[]
  addEmployee: (employee: Omit<Employee, 'id'>) => void
  updateEmployee: (id: number, employee: Partial<Employee>) => void
  deleteEmployee: (id: number) => void
  getEmployeeById: (id: number) => Employee | undefined
}

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Juan Pérez",
    role: "Desarrollador Senior",
    department: "Desarrollo",
    email: "juan.perez@developwave.com",
    phone: "+1 (555) 111-2222",
    location: "San Francisco, CA",
    status: "Activo",
    projects: 3,
    joinDate: "2022-01-15",
  },
  {
    id: 2,
    name: "María García",
    role: "Diseñadora UX/UI",
    department: "Diseño",
    email: "maria.garcia@developwave.com",
    phone: "+1 (555) 222-3333",
    location: "Austin, TX",
    status: "Activo",
    projects: 2,
    joinDate: "2022-03-20",
  },
  {
    id: 3,
    name: "Carlos López",
    role: "Project Manager",
    department: "Gestión",
    email: "carlos.lopez@developwave.com",
    phone: "+1 (555) 333-4444",
    location: "New York, NY",
    status: "Activo",
    projects: 5,
    joinDate: "2021-08-10",
  },
  {
    id: 4,
    name: "Ana Martínez",
    role: "Desarrolladora Frontend",
    department: "Desarrollo",
    email: "ana.martinez@developwave.com",
    phone: "+1 (555) 444-5555",
    location: "Miami, FL",
    status: "Activo",
    projects: 2,
    joinDate: "2023-02-01",
  },
  {
    id: 5,
    name: "Roberto Sánchez",
    role: "Backend Developer",
    department: "Desarrollo",
    email: "roberto.sanchez@developwave.com",
    phone: "+1 (555) 555-6666",
    location: "Los Angeles, CA",
    status: "Activo",
    projects: 4,
    joinDate: "2022-06-15",
  },
  {
    id: 6,
    name: "Laura Torres",
    role: "QA Engineer",
    department: "QA",
    email: "laura.torres@developwave.com",
    phone: "+1 (555) 666-7777",
    location: "Chicago, IL",
    status: "Vacaciones",
    projects: 1,
    joinDate: "2023-04-10",
  },
]

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: initialEmployees,

      addEmployee: (employee) =>
        set((state) => ({
          employees: [
            ...state.employees,
            {
              ...employee,
              id: Math.max(...state.employees.map((e) => e.id), 0) + 1,
            },
          ],
        })),

      updateEmployee: (id, updatedEmployee) =>
        set((state) => ({
          employees: state.employees.map((employee) =>
            employee.id === id ? { ...employee, ...updatedEmployee } : employee
          ),
        })),

      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((employee) => employee.id !== id),
        })),

      getEmployeeById: (id) => {
        return get().employees.find((employee) => employee.id === id)
      },
    }),
    {
      name: 'employee-storage',
    }
  )
)
