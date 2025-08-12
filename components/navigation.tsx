"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Code2, Workflow, Home, GitCompare, FlaskConical, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/prompts", label: "AI Prompts", icon: Code2 },
    { href: "/workflows", label: "Workflows", icon: Workflow },
    { href: "/agents", label: "AI Agents", icon: Bot },
    { href: "/compare", label: "Compare", icon: GitCompare },
    { href: "/laboratory", label: "Laboratory", icon: FlaskConical },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex items-center gap-1">
                <Code2 className="h-6 w-6 text-primary" />
                <Workflow className="h-6 w-6 text-primary" />
              </div>
              <span className="hidden sm:inline">AI Tools & Automation Hub</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                return (
                  <Button
                    key={item.href}
                    asChild
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn("gap-2", isActive && "bg-primary text-primary-foreground")}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Beta
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
