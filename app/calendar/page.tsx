"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Plus, Clock, Users, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const events = [
  {
    id: 1,
    title: "Reunión con TechCorp",
    date: "2024-11-15",
    time: "10:00 AM",
    duration: "1h",
    type: "Reunión",
    attendees: 4,
    location: "Zoom",
  },
  {
    id: 2,
    title: "Demo de Proyecto E-commerce",
    date: "2024-11-15",
    time: "2:00 PM",
    duration: "30min",
    type: "Demo",
    attendees: 6,
    location: "Google Meet",
  },
  {
    id: 3,
    title: "Planning Sprint Q4",
    date: "2024-11-16",
    time: "9:00 AM",
    duration: "2h",
    type: "Planificación",
    attendees: 8,
    location: "Sala de juntas",
  },
  {
    id: 4,
    title: "Review de Código",
    date: "2024-11-16",
    time: "3:00 PM",
    duration: "1h",
    type: "Revisión",
    attendees: 3,
    location: "Zoom",
  },
]

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false)

  const selectedDateEvents = events.filter(
    (event) => new Date(event.date).toDateString() === date?.toDateString()
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">
            Organiza tus reuniones y eventos
          </p>
        </div>
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Evento</DialogTitle>
              <DialogDescription>
                Programa una reunión o evento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="event-title">Título del Evento</Label>
                <Input id="event-title" placeholder="Reunión con cliente" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-date">Fecha</Label>
                  <Input id="event-date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-time">Hora</Label>
                  <Input id="event-time" type="time" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-duration">Duración</Label>
                  <Select>
                    <SelectTrigger id="event-duration">
                      <SelectValue placeholder="Selecciona duración" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 minutos</SelectItem>
                      <SelectItem value="1h">1 hora</SelectItem>
                      <SelectItem value="2h">2 horas</SelectItem>
                      <SelectItem value="4h">4 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-type">Tipo</Label>
                  <Select>
                    <SelectTrigger id="event-type">
                      <SelectValue placeholder="Tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Reunión</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="planning">Planificación</SelectItem>
                      <SelectItem value="review">Revisión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-location">Ubicación</Label>
                <Input id="event-location" placeholder="Zoom, Google Meet, etc." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-description">Descripción</Label>
                <Textarea
                  id="event-description"
                  placeholder="Agenda y detalles del evento..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEventDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setIsEventDialogOpen(false)}>
                Crear Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar and Events */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
            <CardDescription>Selecciona una fecha</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Eventos del{" "}
              {date?.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length} evento(s) programado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {selectedDateEvents.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center">
                  <div className="text-center">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      No hay eventos programados para este día
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <Card key={event.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">
                              {event.title}
                            </CardTitle>
                            <CardDescription className="mt-1 flex items-center gap-2">
                              <Badge variant="outline">{event.type}</Badge>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {event.time} - {event.duration}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {event.attendees} participantes
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
          <CardDescription>Todos los eventos programados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{event.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {new Date(event.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span>{event.time}</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{event.type}</Badge>
                  <Button variant="ghost" size="sm">
                    Ver detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
