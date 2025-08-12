"use client"
import { usePathname } from "next/navigation"
import {
  Code2,
  Workflow,
  Home,
  GitCompare,
  FlaskConical,
  Bot,
  Store,
  Users,
  BarChart3,
  Plug,
  Package,
} from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/prompts", label: "AI Prompts", icon: Code2 },
    { href: "/workflows", label: "Workflows", icon: Workflow },
    { href: "/agents", label: "AI Agents", icon: Bot },
    { href: "/marketplace", label: "API Store", icon: Store },
    { href: "/templates", label: "Templates", icon: Package },
    { href: "/teams", label: "Teams", icon: Users },
    { href: "/integrations", label: "Integrations", icon: Plug },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/compare", label: "Compare", icon: GitCompare },
    { href: "/laboratory", label: "Laboratory", icon: FlaskConical },
  ]
}
