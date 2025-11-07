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
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'team'>) => Promise<void>
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

      // Fetch projects with related data
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
          client_id,
          created_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (projectsError) {
        console.error('Error fetching projects:', projectsError)
        throw projectsError
      }

      // Fetch all related data in parallel
      const projectIds = (projectsData || []).map((p: any) => p.id)

      const [
        { data: teamMembersData },
        { data: milestonesData },
        { data: clientsData },
      ] = await Promise.all([
        supabase.from('team_members').select('*').in('project_id', projectIds),
        supabase.from('payment_milestones').select('*').in('project_id', projectIds),
        supabase.from('clients').select('id, name').eq('user_id', user.id),
      ])

      // Create lookup maps
      const teamMembersMap = new Map<number, TeamMember[]>()
      const milestonesMap = new Map<number, PaymentMilestone[]>()
      const clientsMap = new Map<number, string>()

      teamMembersData?.forEach((tm: any) => {
        const members = teamMembersMap.get(tm.project_id) || []
        members.push({
          id: tm.id,
          name: tm.name,
          role: tm.role,
          avatar: tm.avatar,
        })
        teamMembersMap.set(tm.project_id, members)
      })

      milestonesData?.forEach((ms: any) => {
        const milestones = milestonesMap.get(ms.project_id) || []
        milestones.push({
          id: ms.id,
          name: ms.name,
          percentage: ms.percentage,
          amount: parseFloat(ms.amount),
          status: ms.status,
          dueDate: ms.due_date,
          paidDate: ms.paid_date,
          invoiceId: ms.invoice_id,
          description: ms.description,
        })
        milestonesMap.set(ms.project_id, milestones)
      })

      clientsData?.forEach((c: any) => {
        clientsMap.set(c.id, c.name)
      })

      // Map to Project type
      const projects: Project[] = (projectsData || []).map((p: any) => {
        const teamMembers = teamMembersMap.get(p.id) || []
        const paymentMilestones = milestonesMap.get(p.id) || []

        return {
          id: p.id,
          title: p.title,
          client: clientsMap.get(p.client_id) || 'Unknown Client',
          clientId: p.client_id,
          status: p.status as ProjectStatus,
          progress: p.progress || 0,
          budget: parseFloat(p.budget) || 0,
          spent: parseFloat(p.spent) || 0,
          deadline: p.deadline,
          startDate: p.start_date,
          team: teamMembers.length,
          teamMembers,
          description: p.description || '',
          paymentMilestones,
          totalPaid: parseFloat(p.total_paid) || 0,
          category: p.category,
          priority: p.priority as 'Baja' | 'Media' | 'Alta' | undefined,
          createdAt: p.created_at,
        }
      })

      set({ projects, loading: false, initialized: true })
    } catch (error: any) {
      console.error('Error fetching projects:', error)
      set({ loading: false, initialized: true })
    }
  },

  addProject: async (project) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Insert project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([{
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
          spent: project.spent,
          total_paid: project.totalPaid,
          progress: project.progress,
        }])
        .select()
        .single()

      if (projectError) {
        console.error('Error adding project:', projectError)
        throw projectError
      }

      const projectId = projectData.id

      // Insert team members
      if (project.teamMembers.length > 0) {
        const teamMembersInserts = project.teamMembers.map((tm) => ({
          user_id: user.id,
          project_id: projectId,
          name: tm.name,
          role: tm.role,
          avatar: tm.avatar,
        }))

        const { error: teamError } = await supabase
          .from('team_members')
          .insert(teamMembersInserts)

        if (teamError) {
          console.error('Error adding team members:', teamError)
        }
      }

      // Insert payment milestones
      if (project.paymentMilestones.length > 0) {
        const milestonesInserts = project.paymentMilestones.map((ms) => ({
          user_id: user.id,
          project_id: projectId,
          name: ms.name,
          description: ms.description,
          percentage: ms.percentage,
          amount: ms.amount,
          status: ms.status,
          due_date: ms.dueDate,
          paid_date: ms.paidDate,
          invoice_id: ms.invoiceId,
        }))

        const { error: milestonesError } = await supabase
          .from('payment_milestones')
          .insert(milestonesInserts)

        if (milestonesError) {
          console.error('Error adding payment milestones:', milestonesError)
        }
      }

      // Refresh projects
      await get().fetchProjects()
      set({ loading: false })
    } catch (error: any) {
      console.error('Error adding project:', error)
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

      // Build update object for project table
      const updateData: any = {}
      if (updatedProject.title !== undefined) updateData.title = updatedProject.title
      if (updatedProject.description !== undefined) updateData.description = updatedProject.description
      if (updatedProject.status !== undefined) updateData.status = updatedProject.status
      if (updatedProject.priority !== undefined) updateData.priority = updatedProject.priority
      if (updatedProject.category !== undefined) updateData.category = updatedProject.category
      if (updatedProject.startDate !== undefined) updateData.start_date = updatedProject.startDate
      if (updatedProject.deadline !== undefined) updateData.deadline = updatedProject.deadline
      if (updatedProject.budget !== undefined) updateData.budget = updatedProject.budget
      if (updatedProject.spent !== undefined) updateData.spent = updatedProject.spent
      if (updatedProject.totalPaid !== undefined) updateData.total_paid = updatedProject.totalPaid
      if (updatedProject.progress !== undefined) updateData.progress = updatedProject.progress
      if (updatedProject.clientId !== undefined) updateData.client_id = updatedProject.clientId

      if (Object.keys(updateData).length > 0) {
        const { error: projectError } = await supabase
          .from('projects')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user.id)

        if (projectError) {
          console.error('Error updating project:', projectError)
          throw projectError
        }
      }

      // Handle team members update if provided
      if (updatedProject.teamMembers !== undefined) {
        // Delete existing team members
        await supabase
          .from('team_members')
          .delete()
          .eq('project_id', id)
          .eq('user_id', user.id)

        // Insert new team members
        if (updatedProject.teamMembers.length > 0) {
          const teamMembersInserts = updatedProject.teamMembers.map((tm) => ({
            user_id: user.id,
            project_id: id,
            name: tm.name,
            role: tm.role,
            avatar: tm.avatar,
          }))

          await supabase.from('team_members').insert(teamMembersInserts)
        }
      }

      // Handle payment milestones update if provided
      if (updatedProject.paymentMilestones !== undefined) {
        // Delete existing milestones
        await supabase
          .from('payment_milestones')
          .delete()
          .eq('project_id', id)
          .eq('user_id', user.id)

        // Insert new milestones
        if (updatedProject.paymentMilestones.length > 0) {
          const milestonesInserts = updatedProject.paymentMilestones.map((ms) => ({
            user_id: user.id,
            project_id: id,
            name: ms.name,
            description: ms.description,
            percentage: ms.percentage,
            amount: ms.amount,
            status: ms.status,
            due_date: ms.dueDate,
            paid_date: ms.paidDate,
            invoice_id: ms.invoiceId,
          }))

          await supabase.from('payment_milestones').insert(milestonesInserts)
        }
      }

      // Refresh projects
      await get().fetchProjects()
      set({ loading: false })
    } catch (error: any) {
      console.error('Error updating project:', error)
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
        console.error('Error deleting project:', error)
        throw error
      }

      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error deleting project:', error)
      set({ loading: false })
      throw error
    }
  },

  updateProjectStatus: async (id, status) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating project status:', error)
        throw error
      }

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...project, status } : project
        ),
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error updating project status:', error)
      set({ loading: false })
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
      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.percentage !== undefined) updateData.percentage = updates.percentage
      if (updates.amount !== undefined) updateData.amount = updates.amount
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate
      if (updates.paidDate !== undefined) updateData.paid_date = updates.paidDate
      if (updates.invoiceId !== undefined) updateData.invoice_id = updates.invoiceId

      const { error } = await supabase
        .from('payment_milestones')
        .update(updateData)
        .eq('id', milestoneId)
        .eq('project_id', projectId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating payment milestone:', error)
        throw error
      }

      // Update local state
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
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error updating payment milestone:', error)
      set({ loading: false })
      throw error
    }
  },

  markMilestoneAsPaid: async (projectId, milestoneId, paidDate, invoiceId) => {
    try {
      set({ loading: true })
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Update milestone
      const { error: milestoneError } = await supabase
        .from('payment_milestones')
        .update({
          status: 'Pagada',
          paid_date: paidDate,
          invoice_id: invoiceId,
        })
        .eq('id', milestoneId)
        .eq('project_id', projectId)
        .eq('user_id', user.id)

      if (milestoneError) {
        console.error('Error marking milestone as paid:', milestoneError)
        throw milestoneError
      }

      // Recalculate total paid for the project
      const { data: milestonesData } = await supabase
        .from('payment_milestones')
        .select('amount')
        .eq('project_id', projectId)
        .eq('status', 'Pagada')

      const newTotalPaid = milestonesData?.reduce((sum, m) => sum + parseFloat(m.amount), 0) || 0

      // Update project total_paid
      await supabase
        .from('projects')
        .update({ total_paid: newTotalPaid })
        .eq('id', projectId)
        .eq('user_id', user.id)

      // Update local state
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

            return {
              ...project,
              paymentMilestones: updatedMilestones,
              totalPaid: newTotalPaid,
            }
          }
          return project
        }),
        loading: false,
      }))
    } catch (error: any) {
      console.error('Error marking milestone as paid:', error)
      set({ loading: false })
      throw error
    }
  },
}))
