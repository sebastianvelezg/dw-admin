import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Meeting = {
  id: number
  projectId: number
  title: string
  description: string
  date: string
  time: string
  duration: string
  location: string
  attendees: string[]
  notes?: string
  createdAt: string
}

type MeetingStore = {
  meetings: Meeting[]
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void
  updateMeeting: (id: number, meeting: Partial<Meeting>) => void
  deleteMeeting: (id: number) => void
  getMeetingsByProject: (projectId: number) => Meeting[]
}

const initialMeetings: Meeting[] = [
  {
    id: 1,
    projectId: 1,
    title: "Kickoff Meeting",
    description: "Reunión inicial del proyecto para definir alcance",
    date: "2023-09-15",
    time: "10:00",
    duration: "2h",
    location: "Zoom",
    attendees: ["John Smith", "María García", "Juan Pérez"],
    notes: "Se definieron los objetivos principales y el cronograma",
    createdAt: new Date('2023-09-10').toISOString(),
  },
  {
    id: 2,
    projectId: 1,
    title: "Sprint Review",
    description: "Revisión de progreso del sprint 3",
    date: "2024-11-20",
    time: "14:00",
    duration: "1h",
    location: "Google Meet",
    attendees: ["John Smith", "Equipo Desarrollo"],
    createdAt: new Date('2023-11-15').toISOString(),
  },
]

export const useMeetingStore = create<MeetingStore>()(
  persist(
    (set, get) => ({
      meetings: initialMeetings,

      addMeeting: (meeting) =>
        set((state) => ({
          meetings: [
            ...state.meetings,
            {
              ...meeting,
              id: Math.max(...state.meetings.map((m) => m.id), 0) + 1,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateMeeting: (id, updatedMeeting) =>
        set((state) => ({
          meetings: state.meetings.map((meeting) =>
            meeting.id === id ? { ...meeting, ...updatedMeeting } : meeting
          ),
        })),

      deleteMeeting: (id) =>
        set((state) => ({
          meetings: state.meetings.filter((meeting) => meeting.id !== id),
        })),

      getMeetingsByProject: (projectId) => {
        return get().meetings.filter((meeting) => meeting.projectId === projectId)
      },
    }),
    {
      name: 'meeting-storage',
    }
  )
)
