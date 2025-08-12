"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PromptCard } from "@/components/prompt-card"
import { Search, Filter, X } from "lucide-react"
import { getAllPrompts, getUniqueCategories, getUniqueTools, filterPrompts } from "@/lib/prompt-database"

export default function PromptsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTool, setSelectedTool] = useState("all")
  const [selectedComplexity, setSelectedComplexity] = useState("all")

  const allPrompts = getAllPrompts()
  const categories = getUniqueCategories()
  const tools = getUniqueTools()

  const filteredPrompts = filterPrompts({
    query: searchQuery,
    category: selectedCategory,
    tool: selectedTool,
    complexity: selectedComplexity,
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedTool("all")
    setSelectedComplexity("all")
  }

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedTool !== "all" || selectedComplexity !== "all"

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">System Prompts Explorer</h1>
        <p className="text-lg text-muted-foreground">
          Browse and explore system prompts from leading AI development tools. Select prompts to compare them side by
          side.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts by name, description, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="sm:w-auto bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTool} onValueChange={setSelectedTool}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Tool" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tools</SelectItem>
              {tools.map((tool) => (
                <SelectItem key={tool} value={tool}>
                  {tool}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="sm:w-auto">
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
              </Badge>
            )}
            {selectedTool !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedTool}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedTool("all")} />
              </Badge>
            )}
            {selectedComplexity !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedComplexity}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedComplexity("all")} />
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPrompts.length} of {allPrompts.length} prompts
        </p>
      </div>

      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">No prompts found matching your criteria</p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
