"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TemplateCard } from "@/components/template-card"
import { Navigation } from "@/components/navigation"
import { Bot, Search, Filter, Star, Sparkles } from "lucide-react"
import { getAgentTemplates, getPopularTemplates, type AgentTemplate } from "@/lib/agent-database"

export default function AgentTemplatesPage() {
  const [templates] = useState<AgentTemplate[]>(getAgentTemplates())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedModel, setSelectedModel] = useState("all")
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<AgentTemplate | null>(null)

  const popularTemplates = getPopularTemplates()

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        !searchQuery ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
      const matchesModel = selectedModel === "all" || template.model === selectedModel
      const matchesPopular = !showPopularOnly || template.isPopular

      return matchesSearch && matchesCategory && matchesModel && matchesPopular
    })
  }, [templates, searchQuery, selectedCategory, selectedModel, showPopularOnly])

  const categories = ["all", "Assistant", "Code Helper", "Data Analyst", "Creative", "Research", "Custom"]
  const models = ["all", "grok-beta", "grok-vision-beta"]

  const handleUseTemplate = (template: AgentTemplate) => {
    // Navigate to agent creation with template pre-filled
    const params = new URLSearchParams({
      template: template.id,
    })
    window.location.href = `/agents/create?${params.toString()}`
  }

  const handlePreview = (template: AgentTemplate) => {
    setPreviewTemplate(template)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedModel("all")
    setShowPopularOnly(false)
  }

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedModel !== "all" || showPopularOnly

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
                <Sparkles className="h-10 w-10 text-primary" />
                Agent Templates
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose from pre-built agent templates to quickly create specialized AI assistants
              </p>
            </div>
            <Button asChild size="lg" variant="outline">
              <a href="/agents/create">Create Custom Agent</a>
            </Button>
          </div>

          {/* Popular Templates Section */}
          {popularTemplates.length > 0 && !hasActiveFilters && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
                <Star className="h-6 w-6 text-primary" />
                Popular Templates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUseTemplate={handleUseTemplate}
                    onPreview={handlePreview}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter Templates
              </CardTitle>
              <CardDescription>Find the perfect template for your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                <Select value={selectedModel} onValueChange={setSelectedModel}>
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
                  variant={showPopularOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowPopularOnly(!showPopularOnly)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Popular Only
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
                    Showing {filteredTemplates.length} of {templates.length} templates
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-6">
                  {hasActiveFilters
                    ? "Try adjusting your search filters to find more templates."
                    : "No templates are currently available."}
                </p>
                {hasActiveFilters && <Button onClick={clearFilters}>Clear Filters</Button>}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUseTemplate={handleUseTemplate}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          )}

          {/* Template Preview Dialog */}
          <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              {previewTemplate && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {previewTemplate.name}
                      {previewTemplate.isPopular && (
                        <Badge variant="default" className="gap-1 text-xs">
                          <Star className="h-3 w-3" />
                          Popular
                        </Badge>
                      )}
                    </DialogTitle>
                    <DialogDescription>{previewTemplate.description}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Category</h4>
                        <Badge variant="outline">{previewTemplate.category}</Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Model</h4>
                        <Badge variant="outline">{previewTemplate.model}</Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Temperature</h4>
                        <span className="text-sm text-muted-foreground">{previewTemplate.temperature}</span>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Max Tokens</h4>
                        <span className="text-sm text-muted-foreground">{previewTemplate.maxTokens}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Capabilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {previewTemplate.capabilities.map((capability) => (
                          <Badge key={capability} variant="secondary" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {previewTemplate.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">System Prompt</h4>
                      <div className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {previewTemplate.systemPrompt}
                      </div>
                    </div>

                    {previewTemplate.examples.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Example Use Cases</h4>
                        <div className="space-y-3">
                          {previewTemplate.examples.map((example) => (
                            <div key={example.id} className="border rounded-lg p-3">
                              <h5 className="font-medium text-sm mb-1">{example.title}</h5>
                              <p className="text-xs text-muted-foreground mb-2">User: {example.userMessage}</p>
                              <p className="text-xs text-muted-foreground">Expected: {example.expectedResponse}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button onClick={() => handleUseTemplate(previewTemplate)} className="flex-1">
                        Use This Template
                      </Button>
                      <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </>
  )
}
