"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, Workflow, Database, LinkIcon, Bell, FileText, Zap, Activity } from "lucide-react"
import { WorkflowCard } from "@/components/workflow-card"
import { Navigation } from "@/components/navigation"
import { workflows, workflowCategories, searchWorkflows, getAllWorkflowTags } from "@/lib/workflow-database"
import type { WorkflowSearchFilters } from "@/lib/types"

const categoryIcons = {
  "Data Processing": Database,
  "API Integration": LinkIcon,
  Notifications: Bell,
  "Content Management": FileText,
  Automation: Zap,
  Monitoring: Activity,
}

export default function WorkflowsPage() {
  const [filters, setFilters] = useState<WorkflowSearchFilters>({
    query: "",
    category: "all",
    complexity: "all",
    triggerType: "all",
    tags: [],
  })

  const allTags = getAllWorkflowTags()
  const filteredWorkflows = useMemo(() => searchWorkflows(filters.query, filters), [filters])

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, query: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }))
  }

  const handleComplexityChange = (value: string) => {
    setFilters((prev) => ({ ...prev, complexity: value }))
  }

  const handleTriggerTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, triggerType: value }))
  }

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "all",
      complexity: "all",
      triggerType: "all",
      tags: [],
    })
  }

  const activeFiltersCount = [
    filters.category !== "all",
    filters.complexity !== "all",
    filters.triggerType !== "all",
    filters.tags.length > 0,
  ].filter(Boolean).length

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Workflow className="h-8 w-8 text-primary" />
              n8n Automation Workflows
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover and explore powerful automation workflows for data processing, API integrations, notifications,
              and more.
            </p>
          </div>

          {/* Category Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {workflowCategories.map((category) => {
              const Icon = categoryIcons[category.name as keyof typeof categoryIcons] || Workflow
              const isActive = filters.category === category.name
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isActive ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => handleCategoryChange(isActive ? "all" : category.name)}
                >
                  <CardHeader className="pb-2 text-center">
                    <Icon className="h-6 w-6 mx-auto text-primary mb-2" />
                    <CardTitle className="text-sm">{category.name}</CardTitle>
                    <CardDescription className="text-xs">{category.count} workflows</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search workflows by name, description, or tags..."
                  value={filters.query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filters.complexity} onValueChange={handleComplexityChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.triggerType} onValueChange={handleTriggerTypeChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Triggers</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Webhook">Webhook</SelectItem>
                    <SelectItem value="Schedule">Schedule</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>
                {activeFiltersCount > 0 && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear ({activeFiltersCount})
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category !== "all" ||
              filters.complexity !== "all" ||
              filters.triggerType !== "all" ||
              filters.tags.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {filters.category !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {filters.category}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange("all")} />
                  </Badge>
                )}
                {filters.complexity !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.complexity}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleComplexityChange("all")} />
                  </Badge>
                )}
                {filters.triggerType !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.triggerType}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleTriggerTypeChange("all")} />
                  </Badge>
                )}
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleTagToggle(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{workflows.length} total workflows</span>
            </div>
          </div>

          {/* Workflow Grid */}
          {filteredWorkflows.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredWorkflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Workflow className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria or clearing filters</p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
