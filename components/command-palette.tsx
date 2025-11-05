"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  UserCog,
  BarChart3,
  Calendar,
  Inbox,
  Settings,
  Search,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar páginas y comandos..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup heading="Navegación">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/clients"))}
          >
            <Users className="mr-2 h-4 w-4" />
            Clientes
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/projects"))}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Proyectos
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/finance"))}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Finanzas
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/employees"))}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Empleados
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/reports"))}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Reportes
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/calendar"))}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendario
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/messages"))}
          >
            <Inbox className="mr-2 h-4 w-4" />
            Mensajes
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Acciones">
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </CommandItem>
          <CommandItem>
            <Search className="mr-2 h-4 w-4" />
            Buscar en todo...
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
