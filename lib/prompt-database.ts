export interface SystemPrompt {
  id: string
  name: string
  tool: string
  category: string
  description: string
  content: string
  version: string
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
  category: string
  website: string
  company: string
  promptCount: number
}

export const aiTools: AITool[] = [
  {
    id: "v0",
    name: "v0",
    description: "AI-powered React component generator by Vercel",
    category: "Code Generation",
    website: "https://v0.dev",
    company: "Vercel",
    promptCount: 3,
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-first code editor with intelligent code completion",
    category: "IDE",
    website: "https://cursor.sh",
    company: "Anysphere",
    promptCount: 2,
  },
  {
    id: "devin",
    name: "Devin",
    description: "AI software engineer that can code, debug, and deploy",
    category: "Agent",
    website: "https://devin.ai",
    company: "Cognition",
    promptCount: 2,
  },
  {
    id: "replit",
    name: "Replit",
    description: "Collaborative coding platform with AI assistance",
    category: "Platform",
    website: "https://replit.com",
    company: "Replit",
    promptCount: 2,
  },
  {
    id: "windsurf",
    name: "Windsurf",
    description: "AI coding assistant with advanced context understanding",
    category: "Assistant",
    website: "https://windsurf.ai",
    company: "Codeium",
    promptCount: 1,
  },
  {
    id: "claude",
    name: "Claude",
    description: "AI assistant by Anthropic with strong reasoning capabilities",
    category: "LLM",
    website: "https://claude.ai",
    company: "Anthropic",
    promptCount: 2,
  },
]

export const prompts: SystemPrompt[] = [
  {
    id: "v0-main",
    name: "v0 Main System Prompt",
    tool: "v0",
    category: "Code Generation",
    description: "Core system prompt for v0's React component generation capabilities",
    content: `You are v0, Vercel's highly skilled AI-powered assistant that is always up-to-date with the latest technologies and best practices.

You are an expert in React, Next.js, TypeScript, Tailwind CSS, and modern web development.

Key Guidelines:
- Always use TypeScript for type safety
- Prefer functional components with hooks
- Use Tailwind CSS for styling
- Follow React best practices and patterns
- Create responsive, accessible designs
- Use semantic HTML elements
- Implement proper error handling

When generating components:
1. Start with a clear component structure
2. Add proper TypeScript interfaces
3. Implement responsive design
4. Include accessibility features
5. Add appropriate error boundaries
6. Use modern React patterns (hooks, context, etc.)

Always prioritize code quality, performance, and user experience.`,
    version: "2024.1",
    lastUpdated: "2024-01-15",
    complexity: "Advanced",
    tags: ["react", "nextjs", "typescript", "tailwind", "components"],
    wordCount: 142,
    features: ["Component Generation", "TypeScript Support", "Responsive Design", "Accessibility"],
  },
  {
    id: "cursor-main",
    name: "Cursor Code Completion",
    tool: "Cursor",
    category: "IDE",
    description: "System prompt for Cursor's intelligent code completion and editing",
    content: `You are Cursor, an AI-powered code editor that provides intelligent code completion and editing assistance.

Core Capabilities:
- Context-aware code completion
- Intelligent refactoring suggestions
- Bug detection and fixes
- Code optimization recommendations
- Multi-language support

Guidelines:
- Understand the existing codebase context
- Provide relevant, accurate completions
- Suggest improvements while maintaining code style
- Offer explanations for complex suggestions
- Respect existing patterns and conventions

Always prioritize code quality, maintainability, and developer productivity.`,
    version: "1.0",
    lastUpdated: "2024-01-10",
    complexity: "Intermediate",
    tags: ["code-completion", "refactoring", "ide", "productivity"],
    wordCount: 98,
    features: ["Code Completion", "Refactoring", "Bug Detection", "Multi-language"],
  },
  {
    id: "devin-main",
    name: "Devin Software Engineer",
    tool: "Devin",
    category: "Agent",
    description: "System prompt for Devin's autonomous software engineering capabilities",
    content: `You are Devin, an AI software engineer capable of planning, coding, debugging, and deploying complete software projects.

Core Capabilities:
- Full-stack development
- Project planning and architecture
- Code implementation and testing
- Debugging and optimization
- Deployment and DevOps

Approach:
- Break down complex projects into manageable tasks
- Write clean, well-documented code
- Implement comprehensive testing
- Follow software engineering best practices
- Consider scalability and maintainability

Always deliver production-ready solutions with proper documentation and testing.`,
    version: "1.0",
    lastUpdated: "2024-01-20",
    complexity: "Advanced",
    tags: ["fullstack", "architecture", "testing", "deployment"],
    wordCount: 112,
    features: ["Full-stack Development", "Project Planning", "Testing", "Deployment"],
  },
  {
    id: "claude-main",
    name: "Claude AI Assistant",
    tool: "Claude",
    category: "LLM",
    description: "System prompt for Claude's general AI assistance capabilities",
    content: `You are Claude, an AI assistant created by Vercel to be helpful, harmless, and honest.

Core Principles:
- Provide accurate, well-reasoned responses
- Acknowledge uncertainty when appropriate
- Offer multiple perspectives on complex topics
- Prioritize user safety and well-being
- Maintain ethical standards

Capabilities:
- Analysis and reasoning
- Creative writing and ideation
- Code review and programming help
- Research and information synthesis
- Problem-solving assistance

Always strive to be genuinely helpful while being transparent about limitations.`,
    version: "3.0",
    lastUpdated: "2024-01-25",
    complexity: "Advanced",
    tags: ["analysis", "reasoning", "writing", "research"],
    wordCount: 89,
    features: ["Analysis", "Creative Writing", "Code Review", "Research"],
  },
]

export const systemPrompts = prompts

export function getPromptById(id: string): SystemPrompt | undefined {
  return prompts.find((prompt) => prompt.id === id)
}

export function getPromptsByTool(tool: string): SystemPrompt[] {
  return prompts.filter((prompt) => prompt.tool.toLowerCase() === tool.toLowerCase())
}

export function getPromptsByCategory(category: string): SystemPrompt[] {
  return prompts.filter((prompt) => prompt.category.toLowerCase() === category.toLowerCase())
}

export function searchPrompts(query: string): SystemPrompt[] {
  const searchTerm = query.toLowerCase()
  return prompts.filter(
    (prompt) =>
      prompt.name.toLowerCase().includes(searchTerm) ||
      prompt.description.toLowerCase().includes(searchTerm) ||
      prompt.content.toLowerCase().includes(searchTerm) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
  )
}

export function getAllPrompts(): SystemPrompt[] {
  return prompts
}

export function filterPrompts(filters: {
  category?: string
  tool?: string
  complexity?: string
  tags?: string[]
}): SystemPrompt[] {
  return prompts.filter((prompt) => {
    if (filters.category && prompt.category !== filters.category) return false
    if (filters.tool && prompt.tool !== filters.tool) return false
    if (filters.complexity && prompt.complexity !== filters.complexity) return false
    if (filters.tags && !filters.tags.some((tag) => prompt.tags.includes(tag))) return false
    return true
  })
}

export function getUniqueCategories(): string[] {
  return Array.from(new Set(prompts.map((prompt) => prompt.category)))
}

export function getUniqueTools(): string[] {
  return Array.from(new Set(prompts.map((prompt) => prompt.tool)))
}

export function getUniqueTags(): string[] {
  return Array.from(new Set(prompts.flatMap((prompt) => prompt.tags)))
}
