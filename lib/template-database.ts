import type { Template, TemplateReview, TemplateCollection } from "./types"

export const templates: Template[] = [
  {
    id: "template-1",
    name: "Advanced Code Review Assistant",
    description:
      "AI agent specialized in comprehensive code reviews with security, performance, and best practices analysis",
    type: "agent",
    category: "Development",
    tags: ["code-review", "security", "performance", "best-practices"],
    author: {
      id: "author-1",
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
      bio: "Senior Software Engineer with 8+ years experience in AI and automation",
      verified: true,
      reputation: 4.8,
      totalTemplates: 12,
      totalDownloads: 15420,
    },
    content: {
      agentConfig: {
        name: "Code Review Assistant",
        description: "Comprehensive code review with security and performance analysis",
        systemPrompt:
          "You are an expert code reviewer with deep knowledge of security vulnerabilities, performance optimization, and coding best practices. Analyze code thoroughly and provide actionable feedback.",
        model: "grok-beta",
        temperature: 0.3,
        maxTokens: 2000,
        category: "Code Helper",
        capabilities: ["Security Analysis", "Performance Review", "Best Practices", "Documentation Review"],
      },
    },
    metadata: {
      version: "2.1.0",
      compatibility: ["Grok", "GPT-4", "Claude"],
      requirements: ["Code analysis knowledge", "Security awareness"],
      difficulty: "Advanced",
      estimatedTime: "5 minutes setup",
      language: "Multi-language",
      framework: "Universal",
    },
    stats: {
      downloads: 2847,
      forks: 156,
      likes: 423,
      views: 8934,
      rating: 4.7,
      reviewCount: 89,
      successRate: 94.2,
    },
    pricing: {
      type: "Free",
      license: "MIT",
    },
    status: "Published",
    createdAt: "2024-10-15T10:00:00Z",
    updatedAt: "2024-11-28T14:30:00Z",
    publishedAt: "2024-10-16T09:00:00Z",
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "template-2",
    name: "E-commerce Order Processing Workflow",
    description:
      "Complete n8n workflow for automated order processing, inventory management, and customer notifications",
    type: "workflow",
    category: "E-commerce",
    tags: ["orders", "inventory", "notifications", "automation"],
    author: {
      id: "author-2",
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=MR",
      bio: "E-commerce automation specialist and n8n expert",
      verified: true,
      reputation: 4.6,
      totalTemplates: 8,
      totalDownloads: 9876,
    },
    content: {
      nodes: [
        { id: "webhook", type: "webhook", name: "Order Webhook" },
        { id: "validate", type: "function", name: "Validate Order" },
        { id: "inventory", type: "http", name: "Check Inventory" },
        { id: "payment", type: "stripe", name: "Process Payment" },
        { id: "notify", type: "email", name: "Send Confirmation" },
      ],
      connections: [
        { from: "webhook", to: "validate" },
        { from: "validate", to: "inventory" },
        { from: "inventory", to: "payment" },
        { from: "payment", to: "notify" },
      ],
      variables: [
        { name: "STRIPE_SECRET_KEY", type: "string", description: "Stripe secret key", required: true },
        {
          name: "EMAIL_SERVICE",
          type: "string",
          description: "Email service provider",
          required: true,
          defaultValue: "gmail",
        },
      ],
    },
    metadata: {
      version: "1.5.2",
      compatibility: ["n8n 1.0+"],
      requirements: ["Stripe account", "Email service", "Inventory API"],
      difficulty: "Intermediate",
      estimatedTime: "30 minutes setup",
      framework: "n8n",
    },
    stats: {
      downloads: 1923,
      forks: 234,
      likes: 567,
      views: 6789,
      rating: 4.5,
      reviewCount: 67,
      successRate: 91.8,
    },
    pricing: {
      type: "Premium",
      price: 29.99,
      currency: "USD",
      license: "Commercial",
    },
    status: "Published",
    createdAt: "2024-09-20T14:00:00Z",
    updatedAt: "2024-11-25T16:45:00Z",
    publishedAt: "2024-09-22T10:00:00Z",
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "template-3",
    name: "Technical Documentation Generator",
    description: "AI prompt template for generating comprehensive technical documentation from code and specifications",
    type: "prompt",
    category: "Documentation",
    tags: ["documentation", "technical-writing", "code-analysis"],
    author: {
      id: "author-3",
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=40&width=40&text=AT",
      bio: "Technical writer and documentation specialist",
      verified: false,
      reputation: 4.3,
      totalTemplates: 15,
      totalDownloads: 7654,
    },
    content: {
      systemPrompt:
        "You are a technical documentation expert. Create comprehensive, well-structured documentation that is clear, accurate, and follows industry best practices.",
      userPrompt:
        "Generate technical documentation for the following code/specification: {input}\n\nInclude:\n- Overview and purpose\n- Installation/setup instructions\n- API reference\n- Usage examples\n- Best practices\n- Troubleshooting guide",
      examples: [
        {
          input: "React component for user authentication",
          output:
            "# User Authentication Component\n\n## Overview\nA reusable React component that handles user authentication...",
          description: "Documentation for a React authentication component",
        },
      ],
    },
    metadata: {
      version: "1.2.0",
      compatibility: ["GPT-4", "Claude", "Grok"],
      requirements: ["Code analysis skills", "Technical writing knowledge"],
      difficulty: "Beginner",
      estimatedTime: "2 minutes setup",
      language: "English",
    },
    stats: {
      downloads: 3456,
      forks: 89,
      likes: 234,
      views: 5432,
      rating: 4.2,
      reviewCount: 45,
      successRate: 88.5,
    },
    pricing: {
      type: "Free",
      license: "Apache",
    },
    status: "Published",
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-11-20T11:30:00Z",
    publishedAt: "2024-11-02T14:00:00Z",
    isVerified: false,
    isFeatured: false,
  },
  {
    id: "template-4",
    name: "Slack-GitHub Integration Setup",
    description: "Complete integration template for connecting Slack notifications with GitHub repository events",
    type: "integration",
    category: "Development",
    tags: ["slack", "github", "notifications", "webhooks"],
    author: {
      id: "author-4",
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40&text=EW",
      bio: "DevOps engineer specializing in team collaboration tools",
      verified: true,
      reputation: 4.9,
      totalTemplates: 6,
      totalDownloads: 4321,
    },
    content: {
      integrationConfig: {
        name: "Slack-GitHub Notifications",
        description: "Automated Slack notifications for GitHub events",
        webhooks: ["push", "pull_request", "issues"],
        channels: ["#dev", "#notifications"],
      },
      setupInstructions: [
        "Create a Slack app and get the webhook URL",
        "Configure GitHub webhook to point to your endpoint",
        "Set up event filtering for relevant repository events",
        "Test the integration with a sample push",
      ],
    },
    metadata: {
      version: "1.0.3",
      compatibility: ["Slack API", "GitHub Webhooks"],
      requirements: ["Slack workspace admin", "GitHub repository access"],
      difficulty: "Intermediate",
      estimatedTime: "15 minutes setup",
    },
    stats: {
      downloads: 876,
      forks: 45,
      likes: 123,
      views: 2345,
      rating: 4.6,
      reviewCount: 23,
      successRate: 96.1,
    },
    pricing: {
      type: "Free",
      license: "MIT",
    },
    status: "Published",
    createdAt: "2024-11-10T16:00:00Z",
    updatedAt: "2024-11-28T09:15:00Z",
    publishedAt: "2024-11-11T10:00:00Z",
    isVerified: true,
    isFeatured: true,
  },
]

export const templateReviews: TemplateReview[] = [
  {
    id: "review-1",
    templateId: "template-1",
    userId: "user-1",
    userName: "David Kim",
    userAvatar: "/placeholder.svg?height=32&width=32&text=DK",
    rating: 5,
    title: "Excellent code review assistant!",
    content:
      "This template has significantly improved our code review process. The security analysis is particularly thorough.",
    pros: ["Comprehensive analysis", "Easy to customize", "Great documentation"],
    cons: ["Could use more language-specific rules"],
    createdAt: "2024-11-15T14:30:00Z",
    updatedAt: "2024-11-15T14:30:00Z",
    helpful: 12,
    verified: true,
  },
  {
    id: "review-2",
    templateId: "template-2",
    userId: "user-2",
    userName: "Lisa Zhang",
    userAvatar: "/placeholder.svg?height=32&width=32&text=LZ",
    rating: 4,
    title: "Great workflow, minor setup issues",
    content: "The workflow works well once set up, but the initial configuration took longer than expected.",
    pros: ["Comprehensive features", "Good error handling", "Active support"],
    cons: ["Complex setup", "Requires multiple integrations"],
    createdAt: "2024-11-20T10:15:00Z",
    updatedAt: "2024-11-20T10:15:00Z",
    helpful: 8,
    verified: false,
  },
]

export const templateCollections: TemplateCollection[] = [
  {
    id: "collection-1",
    name: "AI Development Essentials",
    description: "Curated collection of templates for AI-powered development workflows",
    author: {
      id: "author-1",
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
      bio: "Senior Software Engineer with 8+ years experience in AI and automation",
      verified: true,
      reputation: 4.8,
      totalTemplates: 12,
      totalDownloads: 15420,
    },
    templates: ["template-1", "template-3"],
    isPublic: true,
    tags: ["ai", "development", "automation"],
    createdAt: "2024-10-01T12:00:00Z",
    updatedAt: "2024-11-28T15:00:00Z",
    followers: 234,
  },
]

export function getTemplates(): Template[] {
  return templates
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((template) => template.id === id)
}

export function getFeaturedTemplates(): Template[] {
  return templates.filter((template) => template.isFeatured)
}

export function getTemplatesByType(type: string): Template[] {
  return templates.filter((template) => template.type === type)
}

export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter((template) => template.category === category)
}

export function getTemplatesByAuthor(authorId: string): Template[] {
  return templates.filter((template) => template.author.id === authorId)
}

export function searchTemplates(query: string): Template[] {
  const lowercaseQuery = query.toLowerCase()
  return templates.filter(
    (template) =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getTemplateReviews(templateId: string): TemplateReview[] {
  return templateReviews.filter((review) => review.templateId === templateId)
}

export function getTemplateCollections(): TemplateCollection[] {
  return templateCollections
}

export function getTemplateCategories(): string[] {
  return Array.from(new Set(templates.map((template) => template.category)))
}

export function getPopularTemplates(): Template[] {
  return templates.sort((a, b) => b.stats.downloads - a.stats.downloads).slice(0, 6)
}

export function getTopRatedTemplates(): Template[] {
  return templates.sort((a, b) => b.stats.rating - a.stats.rating).slice(0, 6)
}
