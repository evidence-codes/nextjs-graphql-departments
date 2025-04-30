"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Building, LogOut, Plus } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/departments" className="flex items-center space-x-2">
            <Building className="h-6 w-6" />
            <span className="font-bold">Department Manager</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <Link
              href="/departments"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/departments") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Departments
            </Link>
            <Link
              href="/departments/create"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/departments/create") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              <span className="hidden md:inline-block">Create Department</span>
              <Plus className="h-4 w-4 md:hidden" />
            </Link>
          </nav>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="hidden text-sm text-muted-foreground md:inline-block">Logged in as {user.username}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
