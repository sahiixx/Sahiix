"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import {
  getAnalyticsMetrics,
  getUserAnalytics,
  getTeamAnalytics,
  getCostOptimizationSuggestions,
} from "@/lib/analytics-database"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Code2,
  Workflow,
  Bot,
  DollarSign,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const metrics = getAnalyticsMetrics()
  const userAnalytics = getUserAnalytics()
  const teamAnalytics = getTeamAnalytics()
  const costSuggestions = getCostOptimizationSuggestions()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Analytics Dashboard
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Monitor usage, performance, and costs across your AI tools and workflows
              </p>
            </div>
            <div className="flex gap-2">
              {["24h", "7d", "30d", "90d"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="costs">Costs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{metrics.activeUsers} active users</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Prompts</CardTitle>
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalPrompts.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+12% from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Workflows</CardTitle>
                    <Workflow className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalWorkflows.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+8% from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalAgents.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+15% from last week</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                  <CardDescription>Most popular resource categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.topCategories.map((category) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{category.category}</span>
                            {getTrendIcon(category.trend)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {category.count} resources
                          </Badge>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{formatPercentage(category.percentage)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Contributors</CardTitle>
                    <CardDescription>Most active users this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userAnalytics.slice(0, 5).map((user) => (
                        <div key={user.userId} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{user.userName}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.promptsCreated} prompts, {user.workflowsCreated} workflows
                            </p>
                          </div>
                          <Badge variant="outline">Score: {user.activityScore}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Team Performance</CardTitle>
                    <CardDescription>Team collaboration metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamAnalytics.map((team) => (
                        <div key={team.teamId} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{team.teamName}</p>
                            <p className="text-sm text-muted-foreground">
                              {team.memberCount} members, {team.totalResources} resources
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={team.activityLevel === "High" ? "default" : "secondary"} className="mb-1">
                              {team.activityLevel}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{team.collaborationScore}% collaboration</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Usage Trends</CardTitle>
                    <CardDescription>Resource creation over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.usageByDay.slice(-7).map((day) => (
                        <div key={day.date} className="flex items-center justify-between">
                          <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                          <div className="flex gap-4 text-sm">
                            <span>{day.prompts} prompts</span>
                            <span>{day.workflows} workflows</span>
                            <span>{day.agents} agents</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API Usage</CardTitle>
                    <CardDescription>API requests and performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Requests</span>
                        <span className="text-2xl font-bold">{metrics.totalAPIRequests.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Success Rate</span>
                        <span className="text-lg font-semibold text-green-600">
                          {formatPercentage(metrics.performanceMetrics.successRate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Avg Response Time</span>
                        <span className="text-lg font-semibold">
                          {metrics.performanceMetrics.averageResponseTime}ms
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatPercentage(metrics.performanceMetrics.uptime)}</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.performanceMetrics.averageResponseTime}ms</div>
                    <p className="text-xs text-muted-foreground">Average latency</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.performanceMetrics.throughput}</div>
                    <p className="text-xs text-muted-foreground">Requests per minute</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatPercentage(metrics.performanceMetrics.errorRate)}</div>
                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Endpoint Performance</CardTitle>
                    <CardDescription>Latency by API endpoint</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.performanceMetrics.latencyByEndpoint.map((endpoint) => (
                        <div key={endpoint.endpoint} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{endpoint.endpoint}</span>
                            <span className="text-sm">{endpoint.averageLatency}ms avg</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>P95: {endpoint.p95Latency}ms</span>
                            <span>{endpoint.requestCount.toLocaleString()} requests</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Error Analysis</CardTitle>
                    <CardDescription>Error types and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.performanceMetrics.errorsByType.map((error) => (
                        <div key={error.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{error.type}</span>
                            {getTrendIcon(error.trend)}
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">{error.count}</span>
                            <p className="text-xs text-muted-foreground">{formatPercentage(error.percentage)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="costs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.costMetrics.totalCost)}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cost per User</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.costMetrics.costPerUser)}</div>
                    <p className="text-xs text-muted-foreground">Average monthly</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projected Cost</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.costMetrics.estimatedMonthlyCost)}</div>
                    <p className="text-xs text-muted-foreground">Next month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(costSuggestions.reduce((sum, s) => sum + s.potentialSavings, 0))}
                    </div>
                    <p className="text-xs text-muted-foreground">Available optimizations</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost by Service</CardTitle>
                    <CardDescription>Breakdown of costs by service</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.costMetrics.costByService.map((service) => (
                        <div key={service.service} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{service.service}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium">{formatCurrency(service.cost)}</span>
                            <p className="text-xs text-muted-foreground">
                              {service.requests > 0 ? `${service.requests.toLocaleString()} requests` : "Fixed cost"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cost Optimization</CardTitle>
                    <CardDescription>Recommendations to reduce costs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {costSuggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{suggestion.title}</h4>
                            <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                              {suggestion.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                          <p className="text-sm font-medium text-green-600">
                            Potential savings: {formatCurrency(suggestion.potentialSavings)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
