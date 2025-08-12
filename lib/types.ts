export interface SystemPrompt {
  id: string
  name: string
  tool: string
  category: "Code Generation" | "IDE" | "Agent" | "Platform" | "Assistant" | "LLM"
  description: string
  content: string
  version?: string
  lastUpdated: string
  complexity: "Basic" | "Intermediate" | "Advanced"
  tags: string[]
  wordCount: number
  features: string[]
}

export interface AITool {
  id: string
  name: string
  description: string
  category: "Code Generation" | "IDE" | "Agent" | "Platform" | "Assistant" | "LLM"
  website?: string
  company?: string
  promptCount: number
}

export interface SearchFilters {
  query: string
  category: string
  tool: string
  complexity: string
  tags: string[]
}

export interface N8nWorkflow {
  id: string
  name: string
  description: string
  category: "Data Processing" | "API Integration" | "Notifications" | "Content Management" | "Automation" | "Monitoring"
  tags: string[]
  nodes: N8nNode[]
  connections: N8nConnection[]
  version: string
  lastUpdated: string
  complexity: "Basic" | "Intermediate" | "Advanced"
  author?: string
  useCase: string
  estimatedRunTime?: string
  triggerType: "Manual" | "Webhook" | "Schedule" | "Event"
  nodeCount: number
}

export interface N8nNode {
  id: string
  name: string
  type: string
  typeVersion: number
  position: [number, number]
  parameters: Record<string, any>
  credentials?: Record<string, string>
}

export interface N8nConnection {
  node: string
  type: string
  index: number
}

export interface WorkflowCategory {
  id: string
  name: string
  description: string
  count: number
  icon: string
}

export interface WorkflowSearchFilters {
  query: string
  category: string
  complexity: string
  triggerType: string
  tags: string[]
}

export interface UnifiedSearchFilters extends SearchFilters {
  type: "prompts" | "workflows" | "all"
  workflowCategory?: string
  triggerType?: string
}

export interface AIAgent {
  id: string
  name: string
  description: string
  systemPrompt: string
  model: "grok-beta" | "grok-vision-beta"
  temperature: number
  maxTokens: number
  category: "Assistant" | "Code Helper" | "Data Analyst" | "Creative" | "Research" | "Custom"
  tags: string[]
  isActive: boolean
  createdAt: string
  lastUsed?: string
  conversationCount: number
  avatar?: string
  capabilities: string[]
  examples: AgentExample[]
}

export interface AgentExample {
  id: string
  title: string
  userMessage: string
  expectedResponse: string
}

export interface AgentTemplate {
  id: string
  name: string
  description: string
  category: AIAgent["category"]
  systemPrompt: string
  model: AIAgent["model"]
  temperature: number
  maxTokens: number
  tags: string[]
  capabilities: string[]
  examples: AgentExample[]
  isPopular?: boolean
}

export interface Conversation {
  id: string
  agentId: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
  isArchived: boolean
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  tokens?: number
  model?: string
}

export interface AgentSearchFilters {
  query: string
  category: string
  model: string
  tags: string[]
  isActive?: boolean
}

export interface AgentStats {
  totalAgents: number
  activeAgents: number
  totalConversations: number
  totalMessages: number
  popularCategories: { category: string; count: number }[]
  modelUsage: { model: string; count: number }[]
}
