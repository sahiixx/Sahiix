"use client"

export interface PlaygroundExperiment {
  id: string
  name: string
  basePrompt: string
  variations: PromptVariation[]
  results: ExperimentResult[]
  createdAt: string
  tags: string[]
}

export interface PromptVariation {
  id: string
  name: string
  prompt: string
  parameters: VariationParameters
  color: string
}

export interface VariationParameters {
  temperature?: number
  maxTokens?: number
  model?: string
  style?: string
  tone?: string
  complexity?: string
}

export interface ExperimentResult {
  variationId: string
  output: string
  metrics: ResultMetrics
  timestamp: string
}

export interface ResultMetrics {
  responseTime: number
  tokenCount: number
  quality: number
  relevance: number
  creativity: number
}

export const promptTemplates = [
  {
    id: "component-creation",
    name: "Component Creation",
    description: "Create React components with specific requirements",
    basePrompt: "Create a React component for {COMPONENT_TYPE} that {FUNCTIONALITY}",
    variables: ["COMPONENT_TYPE", "FUNCTIONALITY"],
    examples: [
      "Create a React component for a login form that includes email validation and password strength checking",
      "Create a React component for a data table that supports sorting, filtering, and pagination",
    ],
    category: "Code Generation",
  },
  {
    id: "api-integration",
    name: "API Integration",
    description: "Generate API integration code and workflows",
    basePrompt: "Create an API integration that {ACTION} from {SOURCE} to {DESTINATION}",
    variables: ["ACTION", "SOURCE", "DESTINATION"],
    examples: [
      "Create an API integration that syncs user data from Stripe to our CRM system",
      "Create an API integration that fetches weather data from OpenWeather API and displays it",
    ],
    category: "Integration",
  },
  {
    id: "workflow-automation",
    name: "Workflow Automation",
    description: "Design automation workflows for various tasks",
    basePrompt: "Design a workflow that automatically {TASK} when {TRIGGER} occurs",
    variables: ["TASK", "TRIGGER"],
    examples: [
      "Design a workflow that automatically sends welcome emails when new users sign up",
      "Design a workflow that automatically backs up database when disk usage exceeds 80%",
    ],
    category: "Automation",
  },
  {
    id: "data-processing",
    name: "Data Processing",
    description: "Create data transformation and processing solutions",
    basePrompt: "Process {DATA_TYPE} data to {TRANSFORMATION} and output {FORMAT}",
    variables: ["DATA_TYPE", "TRANSFORMATION", "FORMAT"],
    examples: [
      "Process CSV sales data to calculate monthly totals and output JSON reports",
      "Process user activity logs to identify patterns and output visualization charts",
    ],
    category: "Data",
  },
]

export const variationPresets = [
  {
    name: "Detailed",
    parameters: { style: "detailed", complexity: "advanced", tone: "technical" },
    color: "blue",
  },
  {
    name: "Concise",
    parameters: { style: "concise", complexity: "basic", tone: "simple" },
    color: "green",
  },
  {
    name: "Creative",
    parameters: { style: "creative", complexity: "intermediate", tone: "innovative" },
    color: "purple",
  },
  {
    name: "Professional",
    parameters: { style: "professional", complexity: "advanced", tone: "formal" },
    color: "gray",
  },
]

export function generatePromptVariations(basePrompt: string, count = 3): PromptVariation[] {
  const variations: PromptVariation[] = []
  const presets = variationPresets.slice(0, count)

  presets.forEach((preset, index) => {
    const variation: PromptVariation = {
      id: `variation-${index + 1}`,
      name: preset.name,
      prompt: applyVariationStyle(basePrompt, preset.parameters),
      parameters: preset.parameters,
      color: preset.color,
    }
    variations.push(variation)
  })

  return variations
}

function applyVariationStyle(basePrompt: string, parameters: VariationParameters): string {
  let modifiedPrompt = basePrompt

  // Apply style modifications
  switch (parameters.style) {
    case "detailed":
      modifiedPrompt +=
        "\n\nPlease provide detailed explanations, include code comments, and explain the reasoning behind design decisions."
      break
    case "concise":
      modifiedPrompt += "\n\nKeep the response concise and focus on the essential implementation details only."
      break
    case "creative":
      modifiedPrompt +=
        "\n\nFeel free to suggest innovative approaches and creative solutions that go beyond basic requirements."
      break
    case "professional":
      modifiedPrompt +=
        "\n\nEnsure the solution follows industry best practices, includes proper error handling, and is production-ready."
      break
  }

  // Apply tone modifications
  switch (parameters.tone) {
    case "technical":
      modifiedPrompt += " Use technical terminology and assume advanced knowledge."
      break
    case "simple":
      modifiedPrompt += " Explain in simple terms suitable for beginners."
      break
    case "innovative":
      modifiedPrompt += " Focus on cutting-edge techniques and modern approaches."
      break
    case "formal":
      modifiedPrompt += " Maintain a professional and formal tone throughout."
      break
  }

  // Apply complexity modifications
  switch (parameters.complexity) {
    case "basic":
      modifiedPrompt += " Keep the implementation simple and straightforward."
      break
    case "intermediate":
      modifiedPrompt += " Include moderate complexity with some advanced features."
      break
    case "advanced":
      modifiedPrompt += " Implement advanced features, optimizations, and comprehensive error handling."
      break
  }

  return modifiedPrompt
}

export function simulateExperimentResults(variations: PromptVariation[]): ExperimentResult[] {
  return variations.map((variation) => {
    // Simulate different response characteristics based on variation parameters
    const baseResponseTime = 2000
    const responseTimeVariation = Math.random() * 1000
    const responseTime = Math.round(baseResponseTime + responseTimeVariation)

    const baseTokenCount = 150
    const tokenVariation =
      variation.parameters.style === "detailed" ? 100 : variation.parameters.style === "concise" ? -50 : 0
    const tokenCount = Math.round(baseTokenCount + tokenVariation + Math.random() * 50)

    // Quality metrics based on variation type
    const qualityBase =
      variation.parameters.complexity === "advanced" ? 85 : variation.parameters.complexity === "intermediate" ? 75 : 65
    const quality = Math.round(qualityBase + Math.random() * 15)

    const relevanceBase = variation.parameters.style === "professional" ? 90 : 80
    const relevance = Math.round(relevanceBase + Math.random() * 10)

    const creativityBase =
      variation.parameters.tone === "innovative" ? 85 : variation.parameters.style === "creative" ? 80 : 60
    const creativity = Math.round(creativityBase + Math.random() * 15)

    return {
      variationId: variation.id,
      output: generateSampleOutput(variation),
      metrics: {
        responseTime,
        tokenCount,
        quality,
        relevance,
        creativity,
      },
      timestamp: new Date().toISOString(),
    }
  })
}

function generateSampleOutput(variation: PromptVariation): string {
  const outputs = {
    detailed: `Here's a comprehensive implementation with detailed explanations:

\`\`\`typescript
// Detailed component implementation with full TypeScript support
interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>
  isLoading?: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  // Implementation details with extensive comments...
}
\`\`\`

This implementation includes proper TypeScript interfaces, comprehensive error handling, and follows React best practices...`,

    concise: `\`\`\`typescript
const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  )
}
\`\`\``,

    creative: `Here's an innovative approach using modern React patterns:

\`\`\`typescript
// Using compound component pattern with context
const LoginForm = {
  Root: LoginFormRoot,
  Field: LoginFormField,
  Submit: LoginFormSubmit,
}

// Innovative features: biometric auth, progressive enhancement, micro-interactions
\`\`\`

This creative solution incorporates cutting-edge UX patterns and accessibility features...`,

    professional: `Enterprise-grade login form implementation:

\`\`\`typescript
/**
 * Production-ready login form component
 * @version 1.0.0
 * @author Development Team
 */
interface LoginFormProps extends FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (credentials: LoginCredentials) => Promise<AuthResult>
  validationSchema?: ValidationSchema
  securityConfig?: SecurityConfiguration
}

export const LoginForm: React.FC<LoginFormProps> = (props) => {
  // Enterprise implementation with security, monitoring, and compliance...
}
\`\`\`

This implementation meets enterprise security standards and includes comprehensive audit logging...`,
  }

  return outputs[variation.parameters.style as keyof typeof outputs] || outputs.detailed
}

export function createNewExperiment(name: string, basePrompt: string): PlaygroundExperiment {
  const variations = generatePromptVariations(basePrompt)

  return {
    id: `experiment-${Date.now()}`,
    name,
    basePrompt,
    variations,
    results: [],
    createdAt: new Date().toISOString(),
    tags: ["experiment"],
  }
}

export function addVariationToExperiment(
  experiment: PlaygroundExperiment,
  name: string,
  prompt: string,
  parameters: VariationParameters,
): PlaygroundExperiment {
  const newVariation: PromptVariation = {
    id: `variation-${experiment.variations.length + 1}`,
    name,
    prompt,
    parameters,
    color: variationPresets[experiment.variations.length % variationPresets.length].color,
  }

  return {
    ...experiment,
    variations: [...experiment.variations, newVariation],
  }
}
