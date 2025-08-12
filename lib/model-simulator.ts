export interface ModelSimulation {
  model: string
  interpretation: string
  confidence: number
  suggestions: string[]
  expectedOutput: string
  strengths: string[]
  weaknesses: string[]
  processingTime: number
}

export interface ModelProfile {
  id: string
  name: string
  description: string
  specialties: string[]
  promptStyle: string
  outputFormat: string
  strengths: string[]
  limitations: string[]
}

export const modelProfiles: ModelProfile[] = [
  {
    id: "v0",
    name: "v0",
    description: "React component generation",
    specialties: ["React", "TypeScript", "UI Components", "Tailwind CSS"],
    promptStyle: "Direct, component-focused instructions",
    outputFormat: "React/TypeScript code with styling",
    strengths: ["Modern React patterns", "Responsive design", "Clean code structure"],
    limitations: ["Limited to frontend components", "No backend logic"],
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "Code completion and editing",
    specialties: ["Code completion", "Refactoring", "Bug fixes", "Multi-language support"],
    promptStyle: "Context-aware, incremental changes",
    outputFormat: "Code suggestions and completions",
    strengths: ["Context understanding", "Real-time assistance", "Multi-file awareness"],
    limitations: ["Requires existing codebase", "Limited creative generation"],
  },
  {
    id: "devin",
    name: "Devin",
    description: "Full-stack development",
    specialties: ["Full-stack apps", "Database design", "API development", "DevOps"],
    promptStyle: "High-level project requirements",
    outputFormat: "Complete applications with architecture",
    strengths: ["End-to-end development", "Complex problem solving", "Architecture planning"],
    limitations: ["May over-engineer simple tasks", "Longer processing time"],
  },
  {
    id: "claude",
    name: "Claude",
    description: "General AI assistance",
    specialties: ["Analysis", "Writing", "Problem solving", "Code review"],
    promptStyle: "Conversational, detailed explanations",
    outputFormat: "Detailed responses with reasoning",
    strengths: ["Thorough analysis", "Clear explanations", "Versatile capabilities"],
    limitations: ["Less specialized for coding", "Verbose responses"],
  },
]

export function simulateModelResponse(prompt: string, modelId: string): ModelSimulation {
  const model = modelProfiles.find((m) => m.id === modelId) || modelProfiles[0]

  // Analyze prompt characteristics
  const promptWords = prompt.toLowerCase().split(" ")
  const isCodeRequest = promptWords.some((word) =>
    ["create", "build", "make", "component", "function", "app", "website"].includes(word),
  )
  const isUIRequest = promptWords.some((word) => ["form", "button", "page", "layout", "design", "style"].includes(word))
  const isComplexRequest =
    prompt.length > 100 ||
    promptWords.some((word) => ["database", "api", "authentication", "integration", "workflow"].includes(word))

  // Calculate confidence based on model specialties and prompt match
  let confidence = 70
  if (model.specialties.some((specialty) => promptWords.some((word) => specialty.toLowerCase().includes(word)))) {
    confidence += 15
  }
  if (isCodeRequest && ["v0", "cursor", "devin"].includes(modelId)) {
    confidence += 10
  }
  if (isUIRequest && modelId === "v0") {
    confidence += 15
  }
  if (isComplexRequest && modelId === "devin") {
    confidence += 10
  }

  // Generate interpretation based on model characteristics
  let interpretation = ""
  switch (modelId) {
    case "v0":
      interpretation = isUIRequest
        ? `v0 would create a React component for "${prompt.slice(0, 50)}..." with modern styling and TypeScript`
        : `v0 would interpret this as a UI component request and generate React code with appropriate styling`
      break
    case "cursor":
      interpretation = `Cursor would provide contextual code suggestions and completions for "${prompt.slice(0, 50)}..." based on your existing codebase`
      break
    case "devin":
      interpretation = isComplexRequest
        ? `Devin would plan a full-stack solution for "${prompt.slice(0, 50)}..." including architecture, database design, and deployment`
        : `Devin would create a comprehensive implementation with proper project structure and best practices`
      break
    case "claude":
      interpretation = `Claude would provide a detailed analysis and step-by-step approach for "${prompt.slice(0, 50)}..." with explanations and alternatives`
      break
  }

  // Generate model-specific suggestions
  const suggestions = generateSuggestions(prompt, model, isCodeRequest, isUIRequest, isComplexRequest)

  // Generate expected output description
  const expectedOutput = generateExpectedOutput(prompt, model, isCodeRequest, isUIRequest)

  // Calculate processing time (simulated)
  const processingTime = Math.floor(Math.random() * 5000) + 1000 + (isComplexRequest ? 3000 : 0)

  return {
    model: model.name,
    interpretation,
    confidence: Math.min(confidence, 95),
    suggestions,
    expectedOutput,
    strengths: model.strengths,
    weaknesses: model.limitations,
    processingTime,
  }
}

function generateSuggestions(
  prompt: string,
  model: ModelProfile,
  isCodeRequest: boolean,
  isUIRequest: boolean,
  isComplexRequest: boolean,
): string[] {
  const baseSuggestions = [
    `Align with ${model.name}'s ${model.promptStyle.toLowerCase()}`,
    `Consider ${model.outputFormat.toLowerCase()} requirements`,
    "Be specific about desired functionality",
  ]

  const modelSpecificSuggestions: Record<string, string[]> = {
    v0: [
      "Specify component props and styling preferences",
      "Include responsive design requirements",
      "Mention any specific UI libraries or patterns",
    ],
    cursor: [
      "Provide context about existing code structure",
      "Specify the programming language and framework",
      "Include any coding standards or conventions",
    ],
    devin: [
      "Define project scope and technical requirements",
      "Specify database and deployment preferences",
      "Include performance and scalability needs",
    ],
    claude: [
      "Ask for step-by-step explanations if needed",
      "Request alternative approaches or trade-offs",
      "Specify the level of technical detail required",
    ],
  }

  return [...baseSuggestions, ...(modelSpecificSuggestions[model.id] || [])]
}

function generateExpectedOutput(
  prompt: string,
  model: ModelProfile,
  isCodeRequest: boolean,
  isUIRequest: boolean,
): string {
  switch (model.id) {
    case "v0":
      return isUIRequest
        ? "React/TypeScript component with Tailwind CSS styling, proper props interface, and responsive design"
        : "Modern React component with clean code structure and appropriate styling"
    case "cursor":
      return "Contextual code suggestions, auto-completions, and refactoring recommendations based on your codebase"
    case "devin":
      return isCodeRequest
        ? "Complete application with proper architecture, database schema, API endpoints, and deployment configuration"
        : "Comprehensive solution with detailed implementation plan and best practices"
    case "claude":
      return "Detailed explanation with step-by-step approach, code examples, and alternative solutions with pros/cons"
    default:
      return "AI-generated response tailored to the specific prompt requirements"
  }
}
