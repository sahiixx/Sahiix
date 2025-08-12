"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import {
  getIntegrations,
  getPopularIntegrations,
  getConnections,
  getIntegrationCategories,
  getWebhookEvents,
  getSyncLogs,
} from "@/lib/integration-database"
import {
  Plug,
  Search,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Plus,
  Activity,
  Zap,
  Users,
  ExternalLink,
} from "lucide-react"

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Status")

  const allIntegrations = getIntegrations()
  const popularIntegrations = getPopularIntegrations()
  const connections = getConnections()
  const categories = getIntegrationCategories()
  const webhookEvents = getWebhookEvents()
  const syncLogs = getSyncLogs()

  const filteredIntegrations = allIntegrations.filter((integration) => {
    if (
      searchQuery &&
      !integration.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    if (selectedCategory !== "All Categories" && integration.category !== selectedCategory) return false
    if (selectedStatus !== "All Status" && integration.status !== selectedStatus) return false
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Available":
        return <Plug className="h-4 w-4 text-blue-500" />
      case "Disconnected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "Error":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Plug className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected":
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Available":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Disconnected":
      case "Inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Error":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Plug className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Integration Hub</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect your favorite tools and services to automate workflows and sync data seamlessly
            </p>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="browse">Browse</TabsTrigger>
              <TabsTrigger value="connected">Connected ({connections.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Popular Integrations */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Popular Integrations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularIntegrations.map((integration) => (
                    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={integration.logo || "/placeholder.svg"}
                              alt={integration.name}
                              className="h-10 w-10 rounded-lg"
                            />
                            <div>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                {integration.name}
                                {getStatusIcon(integration.status)}
                              </CardTitle>
                              <CardDescription className="text-sm">{integration.description}</CardDescription>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {integration.category}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(integration.status)}`}>
                            {integration.status}
                          </Badge>
                          <Badge className={`text-xs ${getComplexityColor(integration.setupComplexity)}`}>
                            {integration.setupComplexity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {integration.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {integration.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{integration.features.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {integration.connectionCount}
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-4 w-4" />
                              {integration.usageCount}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <a href={integration.documentation} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Connect
                            </Button>
                          </div>
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
                      placeholder="Search integrations by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Status">All Status</SelectItem>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Connected">Connected</SelectItem>
                        <SelectItem value="Disconnected">Disconnected</SelectItem>
                      </SelectContent>
                    </Select>
                    {(selectedCategory !== "All Categories" || selectedStatus !== "All Status" || searchQuery) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("All Categories")
                          setSelectedStatus("All Status")
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* All Integrations */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredIntegrations.length} of {allIntegrations.length} integrations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map((integration) => (
                  <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={integration.logo || "/placeholder.svg"}
                            alt={integration.name}
                            className="h-10 w-10 rounded-lg"
                          />
                          <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              {integration.name}
                              {getStatusIcon(integration.status)}
                            </CardTitle>
                            <CardDescription className="text-sm">{integration.description}</CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">
                          {integration.category}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(integration.status)}`}>{integration.status}</Badge>
                        <Badge className={`text-xs ${getComplexityColor(integration.setupComplexity)}`}>
                          {integration.setupComplexity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {integration.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {integration.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{integration.features.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {integration.connectionCount}
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4" />
                            {integration.usageCount}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <a href={integration.documentation} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Connect
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredIntegrations.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="connected" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {connections.map((connection) => (
                  <Card key={connection.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Plug className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle>{connection.name}</CardTitle>
                            <CardDescription>
                              Connected {formatTimeAgo(connection.createdAt)} • Last used{" "}
                              {formatTimeAgo(connection.lastUsed)}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(connection.status)}`}>{connection.status}</Badge>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Usage Count</p>
                          <p className="text-2xl font-bold">{connection.usageCount}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Auto Sync</p>
                          <p className="text-sm">{connection.settings.autoSync ? "Enabled" : "Disabled"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Notifications</p>
                          <p className="text-sm">{connection.settings.notifications ? "Enabled" : "Disabled"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {connections.length === 0 && (
                  <div className="text-center py-12">
                    <Plug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
                    <p className="text-muted-foreground mb-4">Connect your first integration to get started</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Browse Integrations
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {syncLogs.map((log) => (
                  <Card key={log.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              log.status === "Success"
                                ? "bg-green-100 dark:bg-green-900"
                                : log.status === "Failed"
                                  ? "bg-red-100 dark:bg-red-900"
                                  : "bg-yellow-100 dark:bg-yellow-900"
                            }`}
                          >
                            {log.status === "Success" ? (
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : log.status === "Failed" ? (
                              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{log.type} Operation</CardTitle>
                            <CardDescription>
                              {formatTimeAgo(log.startTime)} • Duration:{" "}
                              {Math.round((new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / 1000)}
                              s
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(log.status)}`}>{log.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Records Processed</p>
                          <p className="text-2xl font-bold text-green-600">{log.recordsProcessed}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Records Failed</p>
                          <p className="text-2xl font-bold text-red-600">{log.recordsFailed}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Success Rate</p>
                          <p className="text-2xl font-bold">
                            {((log.recordsProcessed / (log.recordsProcessed + log.recordsFailed)) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {syncLogs.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                    <p className="text-muted-foreground">
                      Sync logs will appear here once you start using integrations
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {webhookEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{event.event} Event</CardTitle>
                            <CardDescription>
                              {formatTimeAgo(event.timestamp)} • Retries: {event.retryCount}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(event.status)}`}>{event.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Payload:</p>
                        <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                          {JSON.stringify(event.payload, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {webhookEvents.length === 0 && (
                  <div className="text-center py-12">
                    <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No webhook events</h3>
                    <p className="text-muted-foreground">Webhook events will appear here when integrations send data</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
