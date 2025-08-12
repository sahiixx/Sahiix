import type { AnalyticsMetrics, UserAnalytics, TeamAnalytics } from "./types"

export const analyticsMetrics: AnalyticsMetrics = {
  totalUsers: 1247,
  activeUsers: 892,
  totalPrompts: 3456,
  totalWorkflows: 1234,
  totalAgents: 567,
  totalAPIRequests: 45678,
  totalTeams: 89,
  averageSessionDuration: 24.5,
  topCategories: [
    { category: "Code Generation", count: 1234, percentage: 35.7, trend: "up" },
    { category: "Data Processing", count: 987, percentage: 28.5, trend: "up" },
    { category: "AI/ML", count: 654, percentage: 18.9, trend: "stable" },
    { category: "Communication", count: 432, percentage: 12.5, trend: "down" },
    { category: "Analytics", count: 149, percentage: 4.3, trend: "up" },
  ],
  usageByDay: [
    { date: "2024-11-25", prompts: 45, workflows: 23, agents: 12, apiRequests: 567, activeUsers: 89 },
    { date: "2024-11-26", prompts: 52, workflows: 28, agents: 15, apiRequests: 634, activeUsers: 95 },
    { date: "2024-11-27", prompts: 48, workflows: 31, agents: 18, apiRequests: 712, activeUsers: 102 },
    { date: "2024-11-28", prompts: 61, workflows: 35, agents: 22, apiRequests: 823, activeUsers: 118 },
    { date: "2024-11-29", prompts: 58, workflows: 29, agents: 19, apiRequests: 756, activeUsers: 108 },
    { date: "2024-11-30", prompts: 67, workflows: 42, agents: 25, apiRequests: 891, activeUsers: 125 },
    { date: "2024-12-01", prompts: 73, workflows: 38, agents: 28, apiRequests: 945, activeUsers: 132 },
  ],
  costMetrics: {
    totalCost: 2847.5,
    costByService: [
      { service: "OpenAI API", cost: 1234.5, requests: 12345, costPerRequest: 0.1 },
      { service: "Grok API", cost: 567.25, requests: 5672, costPerRequest: 0.1 },
      { service: "Vercel Hosting", cost: 89.0, requests: 0, costPerRequest: 0 },
      { service: "Database", cost: 156.75, requests: 0, costPerRequest: 0 },
    ],
    costTrend: [
      { date: "2024-11-25", cost: 387.5, requests: 2456 },
      { date: "2024-11-26", cost: 412.25, requests: 2634 },
      { date: "2024-11-27", cost: 398.75, requests: 2512 },
      { date: "2024-11-28", cost: 445.5, requests: 2823 },
      { date: "2024-11-29", cost: 423.25, requests: 2656 },
      { date: "2024-11-30", cost: 467.75, requests: 2891 },
      { date: "2024-12-01", cost: 512.5, requests: 3145 },
    ],
    estimatedMonthlyCost: 8542.5,
    costPerUser: 2.28,
    topCostDrivers: [
      { name: "AI Model Inference", cost: 1801.75, percentage: 63.3, type: "API" },
      { name: "Data Storage", cost: 456.25, percentage: 16.0, type: "Storage" },
      { name: "Compute Resources", cost: 389.5, percentage: 13.7, type: "Compute" },
      { name: "Network Transfer", cost: 200.0, percentage: 7.0, type: "Other" },
    ],
  },
  performanceMetrics: {
    averageResponseTime: 245,
    successRate: 99.2,
    errorRate: 0.8,
    uptime: 99.95,
    throughput: 1247,
    latencyByEndpoint: [
      { endpoint: "/api/agents/chat", averageLatency: 1250, p95Latency: 2100, requestCount: 12456 },
      { endpoint: "/api/prompts/generate", averageLatency: 890, p95Latency: 1450, requestCount: 8934 },
      { endpoint: "/api/workflows/execute", averageLatency: 2340, p95Latency: 4200, requestCount: 5678 },
    ],
    errorsByType: [
      { type: "Rate Limit", count: 45, percentage: 45.0, trend: "down" },
      { type: "Timeout", count: 32, percentage: 32.0, trend: "stable" },
      { type: "Auth Error", count: 18, percentage: 18.0, trend: "up" },
      { type: "Server Error", count: 5, percentage: 5.0, trend: "down" },
    ],
  },
}

export const userAnalytics: UserAnalytics[] = [
  {
    userId: "user-1",
    userName: "Alice Johnson",
    totalSessions: 156,
    totalTime: 2340,
    promptsCreated: 89,
    workflowsCreated: 23,
    agentsCreated: 12,
    apiRequestsMade: 1234,
    lastActive: "2024-12-01T16:45:00Z",
    favoriteCategories: ["Code Generation", "AI/ML"],
    activityScore: 92,
  },
  {
    userId: "user-2",
    userName: "Bob Smith",
    totalSessions: 134,
    totalTime: 1980,
    promptsCreated: 67,
    workflowsCreated: 34,
    agentsCreated: 8,
    apiRequestsMade: 987,
    lastActive: "2024-12-01T14:20:00Z",
    favoriteCategories: ["Data Processing", "Automation"],
    activityScore: 85,
  },
]

export const teamAnalytics: TeamAnalytics[] = [
  {
    teamId: "team-1",
    teamName: "AI Development Team",
    memberCount: 8,
    totalResources: 234,
    collaborationScore: 87,
    activityLevel: "High",
    topContributors: userAnalytics.slice(0, 3),
    resourceDistribution: [
      { type: "prompts", count: 145, percentage: 62.0 },
      { type: "workflows", count: 56, percentage: 23.9 },
      { type: "agents", count: 33, percentage: 14.1 },
    ],
    growthMetrics: {
      newMembers: 3,
      newResources: 45,
      engagementRate: 78.5,
      retentionRate: 92.3,
    },
  },
]

export function getAnalyticsMetrics(): AnalyticsMetrics {
  return analyticsMetrics
}

export function getUserAnalytics(): UserAnalytics[] {
  return userAnalytics
}

export function getTeamAnalytics(): TeamAnalytics[] {
  return teamAnalytics
}

export function getTopUsers(limit = 10): UserAnalytics[] {
  return userAnalytics.sort((a, b) => b.activityScore - a.activityScore).slice(0, limit)
}

export function getCostOptimizationSuggestions() {
  return [
    {
      title: "Optimize AI Model Usage",
      description: "Switch to more cost-effective models for simple tasks",
      potentialSavings: 234.5,
      priority: "High",
    },
    {
      title: "Implement Request Caching",
      description: "Cache frequent API responses to reduce redundant calls",
      potentialSavings: 156.25,
      priority: "Medium",
    },
    {
      title: "Batch Processing",
      description: "Group similar requests to improve efficiency",
      potentialSavings: 89.75,
      priority: "Low",
    },
  ]
}
