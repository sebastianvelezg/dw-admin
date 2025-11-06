"use client"

import { usePathname } from 'next/navigation'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { CommandPalette } from "@/components/command-palette"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't show sidebar/header for login and signup pages
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      <CommandPalette />
    </SidebarProvider>
  )
}
