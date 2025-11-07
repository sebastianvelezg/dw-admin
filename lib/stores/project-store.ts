import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

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
  loading: boolean
  initialized: boolean
  fetchProjects: () => Promise<void>
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'team' | 'teamMembers' | 'paymentMilestones' | 'totalPaid' | 'client'>) => Promise<void>
  updateProject: (id: number, project: Partial<Project>) => Promise<void>
  deleteProject: (id: number) => Promise<void>
  updateProjectStatus: (id: number, status: ProjectStatus) => Promise<void>
  getProjectById: (id: number) => Project | undefined
  getProjectsByStatus: (status: ProjectStatus) => Project[]
  updatePaymentMilestone: (projectId: number, milestoneId: number, updates: Partial<PaymentMilestone>) => Promise<void>
  markMilestoneAsPaid: (projectId: number, milestoneId: number, paidDate: string, invoiceId?: number) => Promise<void>
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,
  initialized: false,

  fetchProjects: async () => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ projects: [], loading: false, initialized: true })
        return
      }

      // Fetch projects with client information
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          category,
          start_date,
          deadline,
          budget,
          spent,
          total_paid,
          progress,
          created_at,
          client_id,
          clients (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (projectsError) {
        console.error('Error fetching projects:', {
          message: projectsError.message,
          details: projectsError.details,
          hint: projectsError.hint,
          code: projectsError.code
        })
        throw projectsError
      }

      // Fetch team members for all projects
      const { data: teamMembersData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user.id)

      if (teamError) {
        console.error('Error fetching team members:', teamError)
      }

      // Fetch payment milestones for all projects
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('payment_milestones')
        .select('*')
        .eq('user_id', user.id)

      if (milestonesError) {
        console.error('Error fetching payment milestones:', milestonesError)
      }

      // Group team members and milestones by project_id
      const teamMembersByProject = new Map<number, TeamMember[]>()
      const milestonesByProject = new Map<number, PaymentMilestone[]>()

      if (teamMembersData) {
        teamMembersData.forEach((member: any) => {
          if (!teamMembersByProject.has(member.project_id)) {
            teamMembersByProject.set(member.project_id, [])
          }
          teamMembersByProject.get(member.project_id)!.push({
            id: member.id,
            name: member.name,
            role: member.role,
            avatar: member.avatar
          })
        })
      }

      if (milestonesData) {
        milestonesData.forEach((milestone: any) => {
          if (!milestonesByProject.has(milestone.project_id)) {
            milestonesByProject.set(milestone.project_id, [])
          }
          milestonesByProject.get(milestone.project_id)!.push({
            id: milestone.id,
            name: milestone.name,
            percentage: milestone.percentage,
            amount: Number(milestone.amount),
            status: milestone.status,
            dueDate: milestone.due_date,
            paidDate: milestone.paid_date,
            invoiceId: milestone.invoice_id,
            description: milestone.description
          })
        })
      }

      // Map database fields to Project type
      const projects: Project[] = (projectsData || []).map((project: any) => {
        const teamMembers = teamMembersByProject.get(project.id) || []
        const paymentMilestones = milestonesByProject.get(project.id) || []

        return {
          id: project.id,
          title: project.title,
          client: project.clients?.name || '',
          clientId: project.client_id,
          status: project.status as ProjectStatus,
          progress: project.progress || 0,
          budget: Number(project.budget) || 0,
          spent: Number(project.spent) || 0,
          deadline: project.deadline,
          startDate: project.start_date,
          team: teamMembers.length,
          teamMembers: teamMembers,
          description: project.description || '',
          paymentMilestones: paymentMilestones,
          totalPaid: Number(project.total_paid) || 0,
          category: project.category,
          priority: project.priority as 'Baja' | 'Media' | 'Alta' | undefined,
          createdAt: project.created_at
        }
      })

      set({ projects, loading: false, initialized: true })
    } catch (error: any) {
      console.error('Error fetching projects:', {
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack
      })
      set({ loading: false, initialized: true })
    }
  },

  addProject: async (project) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            client_id: project.clientId,
            title: project.title,
            description: project.description,
            status: project.status,
            priority: project.priority,
            category: project.category,
            start_date: project.startDate,
            deadline: project.deadline,
            budget: project.budget,
            spent: project.spent || 0,
            progress: project.progress || 0,
            total_paid: 0,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error adding project:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      // Refresh projects to get updated data
      await get().fetchProjects()
      set({ loading: false })
    } catch (error: any) {
      console.error('Error adding project:', {
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack
      })
      set({ loading: false })
      throw error
    }
  },

  updateProject: async (id, updatedProject) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const updateData: any = {}

      if (updatedProject.title) updateData.title = updatedProject.title
      if (updatedProject.description !== undefined) updateData.description = updatedProject.description
      if (updatedProject.status) updateData.status = updatedProject.status
      if (updatedProject.priority !== undefined) updateData.priority = updatedProject.priority
      if (updatedProject.category !== undefined) updateData.category = updatedProject.category
      if (updatedProject.startDate) updateData.start_date = updatedProject.startDate
      if (updatedProject.deadline) updateData.deadline = updatedProject.deadline
      if (updatedProject.budget !== undefined) updateData.budget = updatedProject.budget
      if (updatedProject.spent !== undefined) updateData.spent = updatedProject.spent
      if (updatedProject.progress !== undefined) updateData.progress = updatedProject.progress
      if (updatedProject.clientId) updateData.client_id = updatedProject.clientId

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating project:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      // Refresh projects to get updated data
      await get().fetchProjects()
      set({ loading: false })
    } catch (error: any) {
      console.error('Error updating project:', {
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack
      })
      set({ loading: false })
      throw error
    }
  },

  deleteProject: async (id) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting project:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        loading: false
      }))
    } catch (error: any) {
      console.error('Error deleting project:', {
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack
      })
      set({ loading: false })
      throw error
    }
  },

  updateProjectStatus: async (id, status) => {
    try {
      await get().updateProject(id, { status })
    } catch (error) {
      throw error
    }
  },

  getProjectById: (id) => {
    return get().projects.find((project) => project.id === id)
  },

  getProjectsByStatus: (status) => {
    return get().projects.filter((project) => project.status === status)
  },

  updatePaymentMilestone: async (projectId, milestoneId, updates) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const updateData: any = {}
      if (updates.name) updateData.name = updates.name
      if (updates.percentage !== undefined) updateData.percentage = updates.percentage
      if (updates.amount !== undefined) updateData.amount = updates.amount
      if (updates.status) updateData.status = updates.status
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate
      if (updates.paidDate !== undefined) updateData.paid_date = updates.paidDate
      if (updates.invoiceId !== undefined) updateData.invoice_id = updates.invoiceId
      if (updates.description !== undefined) updateData.description = updates.description

      const { error } = await supabase
        .from('payment_milestones')
        .update(updateData)
        .eq('id', milestoneId)
        .eq('project_id', projectId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating milestone:', error)
        throw error
      }

      // Refresh projects to get updated data
      await get().fetchProjects()
      set({ loading: false })
    } catch (error: any) {
      console.error('Error updating milestone:', error)
      set({ loading: false })
      throw error
    }
  },

  markMilestoneAsPaid: async (projectId, milestoneId, paidDate, invoiceId) => {
    try {
      await get().updatePaymentMilestone(projectId, milestoneId, {
        status: 'Pagada',
        paidDate,
        invoiceId
      })
    } catch (error) {
      throw error
    }
  },
}))
