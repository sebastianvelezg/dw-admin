import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

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
  loading: boolean
  initialized: boolean
  fetchEmployees: () => Promise<void>
  addEmployee: (employee: Omit<Employee, 'id' | 'projects'>) => Promise<void>
  updateEmployee: (id: number, employee: Partial<Employee>) => Promise<void>
  deleteEmployee: (id: number) => Promise<void>
  getEmployeeById: (id: number) => Employee | undefined
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  loading: false,
  initialized: false,

  fetchEmployees: async () => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ employees: [], loading: false, initialized: true })
        return
      }

      // Fetch employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('id, name, role, department, email, phone, city, country, status, join_date, notes, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (employeesError) {
        console.error('Error fetching employees:', employeesError)
        throw employeesError
      }

      // Count projects for each employee (from team_members table)
      const { data: projectCounts, error: projectError } = await supabase
        .from('team_members')
        .select('name')
        .eq('user_id', user.id)

      if (projectError) {
        console.error('Error fetching project counts:', projectError)
      }

      // Create a map of employee name to project count
      const projectCountMap = new Map<string, number>()
      if (projectCounts) {
        projectCounts.forEach((member: any) => {
          const count = projectCountMap.get(member.name) || 0
          projectCountMap.set(member.name, count + 1)
        })
      }

      // Map database fields to Employee type
      const employees: Employee[] = (employeesData || []).map((employee: any) => ({
        id: employee.id,
        name: employee.name,
        role: employee.role,
        department: employee.department,
        email: employee.email,
        phone: employee.phone || '',
        location: employee.city && employee.country ? `${employee.city}, ${employee.country}` : employee.city || employee.country || '',
        status: employee.status as 'Activo' | 'Vacaciones' | 'Inactivo',
        projects: projectCountMap.get(employee.name) || 0,
        joinDate: employee.join_date,
        notes: employee.notes || undefined,
      }))

      set({ employees, loading: false, initialized: true })
    } catch (error: any) {
      console.error('Error fetching employees:', error)
      set({ loading: false, initialized: true })
    }
  },

  addEmployee: async (employee) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Split location into city and country
      const [city, country] = employee.location?.split(',').map(s => s.trim()) || ['', '']

      const { data, error } = await supabase
        .from('employees')
        .insert([
          {
            user_id: user.id,
            name: employee.name,
            role: employee.role,
            department: employee.department,
            email: employee.email,
            phone: employee.phone,
            city: city,
            country: country,
            status: employee.status,
            join_date: employee.joinDate,
            notes: employee.notes || null,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error adding employee:', error)
        throw error
      }

      // Add to local state
      const newEmployee: Employee = {
        id: data.id,
        name: data.name,
        role: data.role,
        department: data.department,
        email: data.email,
        phone: data.phone || '',
        location: data.city && data.country ? `${data.city}, ${data.country}` : data.city || data.country || '',
        status: data.status,
        projects: 0,
        joinDate: data.join_date,
        notes: data.notes || undefined,
      }

      set((state) => ({
        employees: [newEmployee, ...state.employees],
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error adding employee:', error)
      set({ loading: false })
      throw error
    }
  },

  updateEmployee: async (id, updatedEmployee) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Build update object
      const updateData: any = {}
      if (updatedEmployee.name) updateData.name = updatedEmployee.name
      if (updatedEmployee.role) updateData.role = updatedEmployee.role
      if (updatedEmployee.department) updateData.department = updatedEmployee.department
      if (updatedEmployee.email) updateData.email = updatedEmployee.email
      if (updatedEmployee.phone !== undefined) updateData.phone = updatedEmployee.phone
      if (updatedEmployee.status) updateData.status = updatedEmployee.status
      if (updatedEmployee.joinDate) updateData.join_date = updatedEmployee.joinDate
      if (updatedEmployee.notes !== undefined) updateData.notes = updatedEmployee.notes

      if (updatedEmployee.location) {
        const [city, country] = updatedEmployee.location.split(',').map(s => s.trim())
        updateData.city = city
        updateData.country = country
      }

      const { data, error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating employee:', error)
        throw error
      }

      // Update local state
      set((state) => ({
        employees: state.employees.map((employee) =>
          employee.id === id
            ? {
                ...employee,
                name: data.name,
                role: data.role,
                department: data.department,
                email: data.email,
                phone: data.phone || '',
                location: data.city && data.country ? `${data.city}, ${data.country}` : data.city || data.country || '',
                status: data.status,
                joinDate: data.join_date,
                notes: data.notes || undefined,
              }
            : employee
        ),
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error updating employee:', error)
      set({ loading: false })
      throw error
    }
  },

  deleteEmployee: async (id) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting employee:', error)
        throw error
      }

      set((state) => ({
        employees: state.employees.filter((employee) => employee.id !== id),
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error deleting employee:', error)
      set({ loading: false })
      throw error
    }
  },

  getEmployeeById: (id) => {
    return get().employees.find((employee) => employee.id === id)
  },
}))
