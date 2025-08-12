"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation } from "@/components/navigation"
import {
  getTemplates,
  getFeaturedTemplates,
  getPopularTemplates,
  getTopRatedTemplates,
  getTemplateCategories,
  searchTemplates,
} from "@/lib/template-database"
import type { Template, TemplateSearchFilters } from "@/lib/types"
import { Package, Search, Star, Download, Heart, GitFork, Crown, TrendingUp, Award, Plus, Verified } from "lucide-react"
import Link from "next/link"

export default function TemplatesPage() {
  const [filters, setFilters] = useState<TemplateSearchFilters>({
    query: "",
    type: "All Types",
    category: "All Categories",
    pricing: "All Pricing",
    difficulty: "All Levels",
    rating: 0,
    tags: [],
    author: "",
    verified: false,
    featured: false,
  })

  const allTemplates = getTemplates()
  const featuredTemplates = getFeaturedTemplates()
  const popularTemplates = getPopularTemplates()
  const topRatedTemplates = getTopRatedTemplates()
  const categories = getTemplateCategories()

  const filteredTemplates = allTemplates.filter((template) => {
    if (filters.query && !searchTemplates(filters.query).includes(template)) return false
    if (filters.type !== "All Types" && template.type !== filters.type) return false
    if (filters.category !== "All Categories" && template.category !== filters.category) return false
    if (filters.pricing !== "All Pricing" && template.pricing.type !== filters.pricing) return false
    if (filters.difficulty !== "All Levels" && template.metadata.difficulty !== filters.difficulty) return false
    if (filters.rating > 0 && template.stats.rating < filters.rating) return false
    if (filters.verified && !template.isVerified) return false
    if (filters.featured && !template.isFeatured) return false
    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prompt":
        return "💬"
      case "workflow":
        return "⚡"
      case "agent":
        return "🤖"
      case "integration":
        return "🔗"
      default:
        return "📦"
    }
  }

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "Free":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Premium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Pay What You Want":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const TemplateCard = ({ template }: { template: Template }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getTypeIcon(template.type)}</div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                {template.name}
                {template.isVerified && <Verified className="h-4 w-4 text-blue-500" />}
                {template.isFeatured && <Crown className="h-4 w-4 text-yellow-500" />}
              </CardTitle>
              <CardDescription className="text-sm mt-1">{template.description}</CardDescription>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={template.author.avatar || "/placeholder.svg"} alt={template.author.name} />
            <AvatarFallback className="text-xs">{template.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{template.author.name}</span>
          {template.author.verified && <Verified className="h-3 w-3 text-blue-500" />}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {template.type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {template.category}
          </Badge>
          <Badge className={`text-xs ${getPricingColor(template.pricing.type)}`}>{template.pricing.type}</Badge>
          <Badge className={`text-xs ${getDifficultyColor(template.metadata.difficulty)}`}>
            {template.metadata.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {formatNumber(template.stats.downloads)}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {formatNumber(template.stats.likes)}
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              {formatNumber(template.stats.forks)}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {renderStars(template.stats.rating)}
            <span className="text-sm text-muted-foreground ml-1">({template.stats.reviewCount})</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/templates/${template.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="sm">
            <GitFork className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Template Marketplace</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover, share, and customize templates for AI prompts, workflows, agents, and integrations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Publish Template
              </Button>
              <Button variant="outline" size="lg">
                <Package className="mr-2 h-5 w-5" />
                My Templates
              </Button>
            </div>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="browse">Browse</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Search and Filters */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates by name, description, or tags..."
                      value={filters.query}
                      onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Types">All Types</SelectItem>
                        <SelectItem value="prompt">Prompts</SelectItem>
                        <SelectItem value="workflow">Workflows</SelectItem>
                        <SelectItem value="agent">Agents</SelectItem>
                        <SelectItem value="integration">Integrations</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Categories">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.pricing}
                      onValueChange={(value) => setFilters({ ...filters, pricing: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Pricing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Pricing">All Pricing</SelectItem>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Pay What You Want">Pay What You Want</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.difficulty}
                      onValueChange={(value) => setFilters({ ...filters, difficulty: value })}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Levels">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    {(filters.type !== "All Types" ||
                      filters.category !== "All Categories" ||
                      filters.pricing !== "All Pricing" ||
                      filters.difficulty !== "All Levels" ||
                      filters.query) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFilters({
                            query: "",
                            type: "All Types",
                            category: "All Categories",
                            pricing: "All Pricing",
                            difficulty: "All Levels",
                            rating: 0,
                            tags: [],
                            author: "",
                            verified: false,
                            featured: false,
                          })
                        }
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredTemplates.length} of {allTemplates.length} templates
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured" className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Crown className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Featured Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="popular" className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Most Popular</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="top-rated" className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Top Rated</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topRatedTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
