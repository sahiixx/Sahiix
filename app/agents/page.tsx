"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AgentCard } from "@/components/agent-card"
import { Navigation } from "@/components/navigation"
import { Bot, Plus, Search, Filter, Users, Activity, MessageSquare, Zap } from "lucide-react"
import { getAllAgents, getAgentStats, type AIAgent } from "@/lib/agent-database"
import type { AgentSearchFilters } from "@/lib/types"

export default function AgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>(getAllAgents())
  const [filters, setFilters] = useState<AgentSearchFilters>({
    query: "",
    category: "all",
    model: "all",
    tags: [],
    isActive: undefined,
  })

  const stats = getAgentStats()

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesQuery =
        !filters.query ||
        agent.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        agent.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        agent.tags.some((tag) => tag.toLowerCase().includes(filters.query.toLowerCase()))

      const matchesCategory = filters.category === "all" || agent.category === filters.category
      const matchesModel = filters.model === "all" || agent.model === filters.model
      const matchesActive = filters.isActive === undefined || agent.isActive === filters.isActive

      return matchesQuery && matchesCategory && matchesModel && matchesActive
    })
  }, [agents, filters])

  const categories = ["all", "Assistant", "Code Helper", "Data Analyst", "Creative", "Research", "Custom"]
  const models = ["all", "grok-beta", "grok-vision-beta"]

  const handleToggleActive = (agentId: string) => {
    setAgents((prev) => prev.map((agent) => (agent.id === agentId ? { ...agent, isActive: !agent.isActive } : agent)))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "all",
      model: "all",
      tags: [],
      isActive: undefined,
    })
  }

  const hasActiveFilters =
    filters.query || filters.category !== "all" || filters.model !== "all" || filters.isActive !== undefined

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
                <Bot className="h-10 w-10 text-primary" />
                AI Agents
              </h1>
              <p className="text-lg text-muted-foreground">
                Create, manage, and interact with custom AI agents powered by Grok
              </p>
            </div>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Agent
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAgents}</div>
                <p className="text-xs text-muted-foreground">{stats.activeAgents} active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalConversations}</div>
                <p className="text-xs text-muted-foreground">{stats.totalMessages} messages</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.popularCategories[0]?.category || "N/A"}</div>
                <p className="text-xs text-muted-foreground">{stats.popularCategories[0]?.count || 0} agents</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Primary Model</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.modelUsage[0]?.model || "N/A"}</div>
                <p className="text-xs text-muted-foreground">{stats.modelUsage[0]?.count || 0} agents</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter Agents
              </CardTitle>
              <CardDescription>Find agents by name, description, category, or tags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search agents..."
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    className="w-full"
                  />
                </div>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filters.model} onValueChange={(value) => setFilters({ ...filters, model: value })}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model === "all" ? "All Models" : model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filters.isActive === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters({ ...filters, isActive: filters.isActive === true ? undefined : true })}
                >
                  Active Only
                </Button>
                <Button
                  variant={filters.isActive === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters({ ...filters, isActive: filters.isActive === false ? undefined : false })}
                >
                  Inactive Only
                </Button>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>
                    Showing {filteredAgents.length} of {agents.length} agents
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agents Grid */}
          {filteredAgents.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No agents found</h3>
                <p className="text-muted-foreground mb-6">
                  {hasActiveFilters
                    ? "Try adjusting your search filters or create a new agent."
                    : "Get started by creating your first AI agent."}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Agent
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} onToggleActive={handleToggleActive} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
