"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { getAPIServices, getAPICategories, searchAPIs, getPopularAPIs } from "@/lib/api-database"
import type { APISearchFilters } from "@/lib/types"
import { Search, Star, ExternalLink, Zap, Shield, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function MarketplacePage() {
  const [filters, setFilters] = useState<APISearchFilters>({
    query: "",
    category: "All Categories",
    pricing: "All Pricing",
    authType: "",
    complexity: "All Levels",
    tags: [],
  })

  const allAPIs = getAPIServices()
  const categories = getAPICategories()
  const popularAPIs = getPopularAPIs()

  const filteredAPIs = allAPIs.filter((api) => {
    if (filters.query && !searchAPIs(filters.query).includes(api)) return false
    if (filters.category !== "All Categories" && api.category !== filters.category) return false
    if (filters.pricing !== "All Pricing" && api.pricing !== filters.pricing) return false
    if (filters.authType && api.authType !== filters.authType) return false
    if (filters.complexity !== "All Levels" && api.integrationComplexity !== filters.complexity) return false
    return true
  })

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "Free":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Freemium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Paid":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Enterprise":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Complex":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">API Marketplace</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover and integrate powerful APIs to enhance your workflows and AI agents
            </p>
          </div>

          {/* Popular APIs Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Popular APIs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularAPIs.map((api) => (
                <Card key={api.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {api.name}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-muted-foreground">{api.popularity}</span>
                          </div>
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">{api.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {api.category}
                      </Badge>
                      <Badge className={`text-xs ${getPricingColor(api.pricing)}`}>{api.pricing}</Badge>
                      <Badge className={`text-xs ${getComplexityColor(api.integrationComplexity)}`}>
                        {api.integrationComplexity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          {api.authType}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {api.rateLimit}
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/marketplace/${api.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search APIs by name, description, or tags..."
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
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
                <Select value={filters.pricing} onValueChange={(value) => setFilters({ ...filters, pricing: value })}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Pricing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Pricing">All Pricing</SelectItem>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Freemium">Freemium</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.complexity}
                  onValueChange={(value) => setFilters({ ...filters, complexity: value })}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Levels">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Complex">Complex</SelectItem>
                  </SelectContent>
                </Select>
                {(filters.category !== "All Categories" ||
                  filters.pricing !== "All Pricing" ||
                  filters.complexity !== "All Levels" ||
                  filters.query) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters({
                        query: "",
                        category: "All Categories",
                        pricing: "All Pricing",
                        authType: "",
                        complexity: "All Levels",
                        tags: [],
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
              Showing {filteredAPIs.length} of {allAPIs.length} APIs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAPIs.map((api) => (
              <Card key={api.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {api.name}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-muted-foreground">{api.popularity}</span>
                        </div>
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">{api.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {api.category}
                    </Badge>
                    <Badge className={`text-xs ${getPricingColor(api.pricing)}`}>{api.pricing}</Badge>
                    <Badge className={`text-xs ${getComplexityColor(api.integrationComplexity)}`}>
                      {api.integrationComplexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {api.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {api.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{api.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        {api.authType}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {api.rateLimit}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <a href={api.documentation} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/marketplace/${api.id}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAPIs.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No APIs found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
