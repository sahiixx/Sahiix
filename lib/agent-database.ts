import type { AIAgent, AgentTemplate, Conversation, AgentStats } from "./types"

// Re-export types for convenience
export type { AIAgent, AgentTemplate, Conversation, AgentStats }

export const agentTemplates: AgentTemplate[] = [
  {
    id: "code-assistant",
    name: "Code Assistant",
    description: "Expert programming assistant for code review, debugging, and optimization",
    category: "Code Helper",
    systemPrompt: `You are an expert programming assistant with deep knowledge of multiple programming languages, frameworks, and best practices. Your role is to:

1. Help with code review and provide constructive feedback
2. Debug issues and suggest solutions
3. Optimize code for performance and readability
4. Explain complex programming concepts clearly
5. Suggest best practices and design patterns

Always provide clear, actionable advice with code examples when relevant. Focus on writing clean, maintainable, and efficient code.`,
    model: "grok-beta",
    temperature: 0.3,
    maxTokens: 2000,
    tags: ["programming", "debugging", "optimization", "code-review"],
    capabilities: ["Code Review", "Debugging", "Optimization", "Best Practices", "Multiple Languages"],
    examples: [
      {
        id: "1",
        title: "Code Review",
        userMessage: "Can you review this React component for performance issues?",
        expectedResponse: "I'll analyze your React component for performance bottlenecks and suggest optimizations...",
      },
      {
        id: "2",
        title: "Debugging Help",
        userMessage: "I'm getting a TypeError in my JavaScript code, can you help?",
        expectedResponse: "Let me help you identify and fix that TypeError. Please share the code and error message...",
      },
    ],
    isPopular: true,
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Specialized in data analysis, visualization, and statistical insights",
    category: "Data Analyst",
    systemPrompt: `You are a professional data analyst with expertise in statistics, data visualization, and business intelligence. Your responsibilities include:

1. Analyzing datasets and identifying patterns
2. Creating meaningful visualizations and reports
3. Performing statistical analysis and hypothesis testing
4. Providing actionable business insights
5. Recommending data-driven solutions

Always explain your methodology clearly and provide context for your findings. Use appropriate statistical methods and visualization techniques.`,
    model: "grok-beta",
    temperature: 0.2,
    maxTokens: 2500,
    tags: ["data-analysis", "statistics", "visualization", "business-intelligence"],
    capabilities: [
      "Statistical Analysis",
      "Data Visualization",
      "Pattern Recognition",
      "Business Insights",
      "Report Generation",
    ],
    examples: [
      {
        id: "1",
        title: "Sales Analysis",
        userMessage: "Analyze this sales data and identify trends",
        expectedResponse:
          "I'll analyze your sales data to identify key trends, seasonal patterns, and growth opportunities...",
      },
    ],
    isPopular: true,
  },
  {
    id: "creative-writer",
    name: "Creative Writer",
    description: "Imaginative writing assistant for stories, content, and creative projects",
    category: "Creative",
    systemPrompt: `You are a creative writing assistant with a flair for storytelling, content creation, and imaginative expression. Your expertise includes:

1. Crafting engaging stories and narratives
2. Developing compelling characters and dialogue
3. Creating marketing copy and content
4. Brainstorming creative ideas
5. Adapting writing style to different audiences

Be creative, engaging, and help users express their ideas in compelling ways. Maintain consistency in tone and style throughout projects.`,
    model: "grok-beta",
    temperature: 0.8,
    maxTokens: 3000,
    tags: ["creative-writing", "storytelling", "content-creation", "marketing"],
    capabilities: [
      "Storytelling",
      "Character Development",
      "Content Creation",
      "Marketing Copy",
      "Creative Brainstorming",
    ],
    examples: [
      {
        id: "1",
        title: "Story Writing",
        userMessage: "Help me write a short story about time travel",
        expectedResponse: "I'd love to help you craft a compelling time travel story. Let's start with the premise...",
      },
    ],
  },
  {
    id: "research-assistant",
    name: "Research Assistant",
    description: "Thorough researcher for academic, business, and general inquiries",
    category: "Research",
    systemPrompt: `You are a meticulous research assistant with strong analytical skills and attention to detail. Your role involves:

1. Conducting thorough research on various topics
2. Synthesizing information from multiple sources
3. Providing well-structured, factual responses
4. Identifying credible sources and references
5. Presenting complex information clearly

Always verify information accuracy and provide balanced perspectives. Structure your responses logically and cite relevant sources when possible.`,
    model: "grok-beta",
    temperature: 0.4,
    maxTokens: 2500,
    tags: ["research", "analysis", "fact-checking", "academic"],
    capabilities: [
      "Information Synthesis",
      "Source Verification",
      "Academic Research",
      "Fact Checking",
      "Report Writing",
    ],
    examples: [
      {
        id: "1",
        title: "Market Research",
        userMessage: "Research the current state of the AI industry",
        expectedResponse:
          "I'll provide a comprehensive overview of the AI industry, including key players, trends, and market dynamics...",
      },
    ],
    isPopular: true,
  },
]

export const mockAgents: AIAgent[] = [
  {
    id: "agent-1",
    name: "CodeMaster Pro",
    description: "Advanced code assistant for full-stack development",
    systemPrompt: agentTemplates[0].systemPrompt,
    model: "grok-beta",
    temperature: 0.3,
    maxTokens: 2000,
    category: "Code Helper",
    tags: ["javascript", "react", "node.js", "debugging"],
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    lastUsed: "2024-01-20T14:30:00Z",
    conversationCount: 25,
    capabilities: ["Code Review", "Debugging", "Optimization", "Best Practices"],
    examples: agentTemplates[0].examples,
  },
  {
    id: "agent-2",
    name: "DataViz Expert",
    description: "Specialized data analysis and visualization assistant",
    systemPrompt: agentTemplates[1].systemPrompt,
    model: "grok-beta",
    temperature: 0.2,
    maxTokens: 2500,
    category: "Data Analyst",
    tags: ["python", "pandas", "matplotlib", "statistics"],
    isActive: true,
    createdAt: "2024-01-10T09:00:00Z",
    lastUsed: "2024-01-19T16:45:00Z",
    conversationCount: 18,
    capabilities: ["Statistical Analysis", "Data Visualization", "Pattern Recognition"],
    examples: agentTemplates[1].examples,
  },
  {
    id: "agent-3",
    name: "Creative Muse",
    description: "Inspiring creative writing and content assistant",
    systemPrompt: agentTemplates[2].systemPrompt,
    model: "grok-beta",
    temperature: 0.8,
    maxTokens: 3000,
    category: "Creative",
    tags: ["writing", "storytelling", "content", "marketing"],
    isActive: false,
    createdAt: "2024-01-05T11:00:00Z",
    conversationCount: 12,
    capabilities: ["Storytelling", "Content Creation", "Creative Brainstorming"],
    examples: agentTemplates[2].examples,
  },
]

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    agentId: "agent-1",
    title: "React Performance Optimization",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "How can I optimize this React component for better performance?",
        timestamp: "2024-01-20T14:30:00Z",
      },
      {
        id: "msg-2",
        role: "assistant",
        content: "I'll help you optimize your React component. Here are several strategies you can implement...",
        timestamp: "2024-01-20T14:30:15Z",
        tokens: 450,
        model: "grok-beta",
      },
    ],
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:35:00Z",
    isArchived: false,
  },
]

// Utility functions
export function getAllAgents(): AIAgent[] {
  return mockAgents
}

export function getAgentById(id: string): AIAgent | undefined {
  return mockAgents.find((agent) => agent.id === id)
}

export function getActiveAgents(): AIAgent[] {
  return mockAgents.filter((agent) => agent.isActive)
}

export function getAgentsByCategory(category: string): AIAgent[] {
  if (category === "all") return mockAgents
  return mockAgents.filter((agent) => agent.category === category)
}

export function searchAgents(query: string): AIAgent[] {
  const lowercaseQuery = query.toLowerCase()
  return mockAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(lowercaseQuery) ||
      agent.description.toLowerCase().includes(lowercaseQuery) ||
      agent.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getAgentStats(): AgentStats {
  const totalAgents = mockAgents.length
  const activeAgents = mockAgents.filter((agent) => agent.isActive).length
  const totalConversations = mockAgents.reduce((sum, agent) => sum + agent.conversationCount, 0)
  const totalMessages = mockConversations.reduce((sum, conv) => sum + conv.messages.length, 0)

  const categoryCount = mockAgents.reduce(
    (acc, agent) => {
      acc[agent.category] = (acc[agent.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const modelCount = mockAgents.reduce(
    (acc, agent) => {
      acc[agent.model] = (acc[agent.model] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalAgents,
    activeAgents,
    totalConversations,
    totalMessages,
    popularCategories: Object.entries(categoryCount).map(([category, count]) => ({ category, count })),
    modelUsage: Object.entries(modelCount).map(([model, count]) => ({ model, count })),
  }
}

export function getConversationsByAgent(agentId: string): Conversation[] {
  return mockConversations.filter((conv) => conv.agentId === agentId)
}

export function getAgentTemplates(): AgentTemplate[] {
  return agentTemplates
}

export function getPopularTemplates(): AgentTemplate[] {
  return agentTemplates.filter((template) => template.isPopular)
}
