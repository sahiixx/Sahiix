import { systemPrompts, type SystemPrompt } from "./prompt-database"

export interface OptimizationResult {
  originalPrompt: string
  optimizedPrompt: string
  improvements: string[]
  expertPrompts: SystemPrompt[]
  confidence: number
  optimizationReason: string
  suggestions: string[]
}

export interface PromptAnalysis {
  wordCount: number
  complexity: "Basic" | "Intermediate" | "Advanced"
  clarity: number
  specificity: number
  structure: number
  missingElements: string[]
  strengths: string[]
}

export function analyzePrompt(prompt: string): PromptAnalysis {
  const words = prompt.trim().split(/\s+/)
  const wordCount = words.length

  // Analyze complexity based on technical terms and length
  const technicalTerms = [
    "component",
    "function",
    "api",
    "database",
    "authentication",
    "responsive",
    "typescript",
    "react",
    "nextjs",
    "tailwind",
    "hooks",
    "state",
    "props",
    "interface",
    "async",
    "await",
  ]
  const techTermCount = words.filter((word) => technicalTerms.some((term) => word.toLowerCase().includes(term))).length

  let complexity: "Basic" | "Intermediate" | "Advanced" = "Basic"
  if (wordCount > 50 && techTermCount > 3) complexity = "Advanced"
  else if (wordCount > 20 && techTermCount > 1) complexity = "Intermediate"

  // Calculate clarity (0-100) based on specific words and structure
  const clarityIndicators = ["create", "build", "make", "add", "implement", "design", "with", "that", "should", "must"]
  const clarityScore = Math.min(
    100,
    (words.filter((word) => clarityIndicators.some((indicator) => word.toLowerCase().includes(indicator))).length /
      words.length) *
      200,
  )

  // Calculate specificity (0-100) based on detailed requirements
  const specificityIndicators = ["color", "size", "style", "layout", "button", "form", "page", "component", "feature"]
  const specificityScore = Math.min(
    100,
    (words.filter((word) => specificityIndicators.some((indicator) => word.toLowerCase().includes(indicator))).length /
      words.length) *
      150,
  )

  // Calculate structure (0-100) based on organization
  const hasStructure =
    prompt.includes("1.") ||
    prompt.includes("-") ||
    prompt.includes("•") ||
    prompt.includes("Requirements:") ||
    prompt.includes("Features:")
  const structureScore = hasStructure ? 80 : Math.min(80, wordCount * 2)

  // Identify missing elements
  const missingElements: string[] = []
  if (!prompt.toLowerCase().includes("style") && !prompt.toLowerCase().includes("design")) {
    missingElements.push("Styling preferences")
  }
  if (!prompt.toLowerCase().includes("responsive") && !prompt.toLowerCase().includes("mobile")) {
    missingElements.push("Responsive design requirements")
  }
  if (wordCount < 10) {
    missingElements.push("Detailed requirements")
  }
  if (!prompt.includes("component") && !prompt.includes("page") && !prompt.includes("app")) {
    missingElements.push("Clear output type specification")
  }

  // Identify strengths
  const strengths: string[] = []
  if (wordCount > 30) strengths.push("Detailed description")
  if (techTermCount > 2) strengths.push("Technical specificity")
  if (clarityScore > 60) strengths.push("Clear intent")
  if (specificityScore > 50) strengths.push("Specific requirements")

  return {
    wordCount,
    complexity,
    clarity: Math.round(clarityScore),
    specificity: Math.round(specificityScore),
    structure: Math.round(structureScore),
    missingElements,
    strengths,
  }
}

export function optimizePrompt(prompt: string, targetTool = "v0"): OptimizationResult {
  const analysis = analyzePrompt(prompt)

  // Find relevant expert prompts
  const expertPrompts = systemPrompts
    .filter(
      (p) =>
        p.tool.toLowerCase() === targetTool.toLowerCase() ||
        p.tags.some((tag) => prompt.toLowerCase().includes(tag)) ||
        p.category.toLowerCase().includes(targetTool.toLowerCase()),
    )
    .slice(0, 3)

  // Extract best practices from expert prompts
  const bestPractices = extractBestPractices(expertPrompts, targetTool)

  // Generate optimized prompt
  const optimizedPrompt = generateOptimizedPrompt(prompt, analysis, bestPractices, targetTool)

  // Calculate confidence based on analysis and available expert knowledge
  const confidence = calculateOptimizationConfidence(analysis, expertPrompts.length)

  // Generate improvements list
  const improvements = generateImprovements(analysis, bestPractices)

  // Generate optimization reason
  const optimizationReason = generateOptimizationReason(analysis, targetTool, expertPrompts.length)

  // Generate suggestions for further improvement
  const suggestions = generateSuggestions(analysis, targetTool)

  return {
    originalPrompt: prompt,
    optimizedPrompt,
    improvements,
    expertPrompts,
    confidence,
    optimizationReason,
    suggestions,
  }
}

function extractBestPractices(expertPrompts: SystemPrompt[], targetTool: string): string[] {
  const practices: string[] = []

  expertPrompts.forEach((prompt) => {
    const content = prompt.content.toLowerCase()

    // Extract key practices based on content analysis
    if (content.includes("typescript")) practices.push("Use TypeScript for type safety")
    if (content.includes("responsive")) practices.push("Implement responsive design")
    if (content.includes("accessibility")) practices.push("Include accessibility features")
    if (content.includes("error handling")) practices.push("Add proper error handling")
    if (content.includes("performance")) practices.push("Optimize for performance")
    if (content.includes("semantic html")) practices.push("Use semantic HTML elements")
    if (content.includes("tailwind")) practices.push("Use Tailwind CSS for styling")
    if (content.includes("hooks")) practices.push("Use modern React patterns and hooks")
  })

  // Add tool-specific practices
  switch (targetTool.toLowerCase()) {
    case "v0":
      practices.push("Create reusable React components", "Follow modern design principles")
      break
    case "cursor":
      practices.push("Provide clear context", "Use incremental improvements")
      break
    case "devin":
      practices.push("Include architecture considerations", "Plan for scalability")
      break
    case "claude":
      practices.push("Request detailed explanations", "Ask for alternative approaches")
      break
  }

  return [...new Set(practices)] // Remove duplicates
}

function generateOptimizedPrompt(
  originalPrompt: string,
  analysis: PromptAnalysis,
  bestPractices: string[],
  targetTool: string,
): string {
  let optimized = originalPrompt

  // Add context if missing
  if (analysis.wordCount < 20) {
    optimized = `Create a ${originalPrompt.toLowerCase().includes("component") ? "React component" : "solution"} that ${originalPrompt.toLowerCase()}.`
  }

  // Add tool-specific enhancements
  const toolEnhancements: Record<string, string> = {
    v0: "\n\nRequirements:\n- Use TypeScript with proper interfaces\n- Implement responsive design with Tailwind CSS\n- Include accessibility features\n- Follow React best practices",
    cursor:
      "\n\nContext:\n- Working in an existing codebase\n- Need incremental improvements\n- Maintain code consistency",
    devin:
      "\n\nProject Requirements:\n- Full-stack implementation\n- Scalable architecture\n- Production-ready code\n- Include testing strategy",
    claude:
      "\n\nPlease provide:\n- Step-by-step explanation\n- Alternative approaches\n- Pros and cons of each solution",
  }

  // Add missing elements based on analysis
  if (analysis.missingElements.includes("Styling preferences")) {
    optimized += "\n- Use modern, clean design with appropriate colors and spacing"
  }
  if (analysis.missingElements.includes("Responsive design requirements")) {
    optimized += "\n- Ensure mobile-first responsive design"
  }

  // Add tool-specific enhancement
  if (toolEnhancements[targetTool.toLowerCase()]) {
    optimized += toolEnhancements[targetTool.toLowerCase()]
  }

  // Add best practices reminder
  if (bestPractices.length > 0) {
    optimized += `\n\nKey Practices:\n${bestPractices
      .slice(0, 3)
      .map((practice) => `- ${practice}`)
      .join("\n")}`
  }

  return optimized
}

function calculateOptimizationConfidence(analysis: PromptAnalysis, expertPromptCount: number): number {
  let confidence = 50 // Base confidence

  // Boost confidence based on analysis quality
  confidence += Math.min(20, analysis.clarity / 5)
  confidence += Math.min(15, analysis.specificity / 7)
  confidence += Math.min(10, analysis.structure / 10)

  // Boost confidence based on available expert knowledge
  confidence += Math.min(15, expertPromptCount * 5)

  // Reduce confidence for very basic prompts
  if (analysis.wordCount < 5) confidence -= 20
  if (analysis.complexity === "Basic" && analysis.wordCount < 15) confidence -= 10

  return Math.max(30, Math.min(95, Math.round(confidence)))
}

function generateImprovements(analysis: PromptAnalysis, bestPractices: string[]): string[] {
  const improvements: string[] = []

  if (analysis.clarity < 70) improvements.push("Enhanced clarity and intent")
  if (analysis.specificity < 60) improvements.push("Added specific requirements and constraints")
  if (analysis.structure < 60) improvements.push("Improved prompt structure and organization")
  if (analysis.missingElements.length > 0) improvements.push("Included missing essential elements")
  if (bestPractices.length > 0) improvements.push("Incorporated expert best practices")

  improvements.push("Aligned with target tool capabilities")
  improvements.push("Added context for better understanding")

  return improvements
}

function generateOptimizationReason(analysis: PromptAnalysis, targetTool: string, expertCount: number): string {
  const reasons: string[] = []

  if (analysis.wordCount < 15) reasons.push("expanded brief prompt with essential details")
  if (analysis.clarity < 70) reasons.push("clarified intent and requirements")
  if (analysis.specificity < 60) reasons.push("added specific technical requirements")
  if (expertCount > 0) reasons.push(`incorporated ${expertCount} expert prompt patterns`)

  reasons.push(`optimized for ${targetTool}'s capabilities and output format`)

  return `Optimized by ${reasons.join(", ")}.`
}

function generateSuggestions(analysis: PromptAnalysis, targetTool: string): string[] {
  const suggestions: string[] = []

  if (analysis.wordCount < 30) {
    suggestions.push("Consider adding more specific details about desired functionality")
  }
  if (!analysis.strengths.includes("Technical specificity")) {
    suggestions.push("Include technical requirements like frameworks, libraries, or patterns")
  }
  if (analysis.missingElements.includes("Styling preferences")) {
    suggestions.push("Specify design preferences, color schemes, or UI library choices")
  }

  // Tool-specific suggestions
  switch (targetTool.toLowerCase()) {
    case "v0":
      suggestions.push("Mention component props, state requirements, or interaction patterns")
      break
    case "cursor":
      suggestions.push("Provide context about existing code structure or conventions")
      break
    case "devin":
      suggestions.push("Include deployment, testing, or scalability requirements")
      break
    case "claude":
      suggestions.push("Ask for explanations, alternatives, or step-by-step breakdowns")
      break
  }

  return suggestions.slice(0, 4) // Limit to 4 suggestions
}
