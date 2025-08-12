export interface SyncLog {
  id: string
  connectionId: string
  type: "Import" | "Export" | "Sync"
  status: "Success" | "Failed" | "Partial"
  recordsProcessed: number
  recordsFailed: number
  startTime: string
  endTime: string
  errorDetails?: string[]
}

// Adding template marketplace types
export interface Template {
  id: string
  name: string
  description: string
  type: "prompt" | "workflow" | "agent" | "integration"
  category: string
  tags: string[]
  author: TemplateAuthor
  content: TemplateContent
  metadata: TemplateMetadata
  stats: TemplateStats
  pricing: TemplatePricing
  status: "Published" | "Draft" | "Archived" | "Under Review"
  createdAt: string
  updatedAt: string
  publishedAt?: string
  isVerified: boolean
  isFeatured: boolean
}

export interface TemplateAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
  verified: boolean
  reputation: number
  totalTemplates: number
  totalDownloads: number
}

export interface TemplateContent {
  // For prompt templates
  systemPrompt?: string
  userPrompt?: string
  examples?: PromptExample[]

  // For workflow templates
  nodes?: any[]
  connections?: any[]
  variables?: TemplateVariable[]

  // For agent templates
  agentConfig?: any // Placeholder for AIAgent

  // For integration templates
  integrationConfig?: any
  setupInstructions?: string[]
}

export interface PromptExample {
  input: string
  output: string
  description: string
}

export interface TemplateVariable {
  name: string
  type: "string" | "number" | "boolean" | "array" | "object"
  description: string
  defaultValue?: any
  required: boolean
}

export interface TemplateMetadata {
  version: string
  compatibility: string[]
  requirements: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: string
  language?: string
  framework?: string
}

export interface TemplateStats {
  downloads: number
  forks: number
  likes: number
  views: number
  rating: number
  reviewCount: number
  successRate?: number
}

export interface TemplatePricing {
  type: "Free" | "Premium" | "Pay What You Want"
  price?: number
  currency?: string
  license: "MIT" | "Apache" | "GPL" | "Commercial" | "Custom"
}

export interface TemplateReview {
  id: string
  templateId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  createdAt: string
  updatedAt: string
  helpful: number
  verified: boolean
}

export interface TemplateCollection {
  id: string
  name: string
  description: string
  author: TemplateAuthor
  templates: string[]
  isPublic: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  followers: number
}

export interface TemplateSearchFilters {
  query: string
  type: string
  category: string
  pricing: string
  difficulty: string
  rating: number
  tags: string[]
  author: string
  verified: boolean
  featured: boolean
}

// Placeholder for AIAgent interface
export type AIAgent = {}
