import type { N8nWorkflow, WorkflowNode } from "./workflow-database"

export interface WorkflowGenerationRequest {
  description: string
  category?: string
  triggerType?: "webhook" | "schedule" | "manual"
  integrations?: string[]
  complexity?: "Basic" | "Intermediate" | "Advanced"
}

export interface GeneratedWorkflow {
  workflow: N8nWorkflow
  explanation: string
  suggestions: string[]
  confidence: number
  templateUsed: string[]
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  nodes: WorkflowNode[]
  connections: any[]
  variables: string[]
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "webhook-notification",
    name: "Webhook to Notification",
    description: "Receive webhook data and send notifications",
    category: "Notifications",
    nodes: [
      {
        id: "webhook",
        name: "Webhook Trigger",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [250, 300],
        parameters: {
          httpMethod: "POST",
          path: "{{WEBHOOK_PATH}}",
        },
      },
      {
        id: "notification",
        name: "Send Notification",
        type: "n8n-nodes-base.{{NOTIFICATION_TYPE}}",
        typeVersion: 1,
        position: [450, 300],
        parameters: {
          channel: "{{CHANNEL}}",
          text: "{{MESSAGE_TEMPLATE}}",
        },
      },
    ],
    connections: [
      { node: "webhook", type: "main", index: 0 },
      { node: "notification", type: "main", index: 0 },
    ],
    variables: ["WEBHOOK_PATH", "NOTIFICATION_TYPE", "CHANNEL", "MESSAGE_TEMPLATE"],
  },
  {
    id: "scheduled-data-processing",
    name: "Scheduled Data Processing",
    description: "Process data on a schedule with transformation and storage",
    category: "Data Processing",
    nodes: [
      {
        id: "schedule",
        name: "Schedule Trigger",
        type: "n8n-nodes-base.cron",
        typeVersion: 1,
        position: [250, 300],
        parameters: {
          rule: "{{CRON_SCHEDULE}}",
        },
      },
      {
        id: "data-source",
        name: "Get Data",
        type: "n8n-nodes-base.{{DATA_SOURCE_TYPE}}",
        typeVersion: 1,
        position: [450, 300],
        parameters: "{{DATA_SOURCE_PARAMS}}",
      },
      {
        id: "transform",
        name: "Transform Data",
        type: "n8n-nodes-base.function",
        typeVersion: 1,
        position: [650, 300],
        parameters: {
          functionCode: "{{TRANSFORMATION_CODE}}",
        },
      },
      {
        id: "storage",
        name: "Store Data",
        type: "n8n-nodes-base.{{STORAGE_TYPE}}",
        typeVersion: 1,
        position: [850, 300],
        parameters: "{{STORAGE_PARAMS}}",
      },
    ],
    connections: [
      { node: "schedule", type: "main", index: 0 },
      { node: "data-source", type: "main", index: 0 },
      { node: "transform", type: "main", index: 0 },
      { node: "storage", type: "main", index: 0 },
    ],
    variables: [
      "CRON_SCHEDULE",
      "DATA_SOURCE_TYPE",
      "DATA_SOURCE_PARAMS",
      "TRANSFORMATION_CODE",
      "STORAGE_TYPE",
      "STORAGE_PARAMS",
    ],
  },
  {
    id: "api-integration",
    name: "API Integration",
    description: "Connect two APIs with data transformation",
    category: "API Integration",
    nodes: [
      {
        id: "trigger",
        name: "{{TRIGGER_NAME}}",
        type: "n8n-nodes-base.{{TRIGGER_TYPE}}",
        typeVersion: 1,
        position: [250, 300],
        parameters: "{{TRIGGER_PARAMS}}",
      },
      {
        id: "source-api",
        name: "Source API",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 1,
        position: [450, 300],
        parameters: {
          url: "{{SOURCE_API_URL}}",
          method: "GET",
        },
      },
      {
        id: "transform",
        name: "Transform Data",
        type: "n8n-nodes-base.function",
        typeVersion: 1,
        position: [650, 300],
        parameters: {
          functionCode: "{{TRANSFORMATION_LOGIC}}",
        },
      },
      {
        id: "target-api",
        name: "Target API",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 1,
        position: [850, 300],
        parameters: {
          url: "{{TARGET_API_URL}}",
          method: "POST",
          body: "={{$json}}",
        },
      },
    ],
    connections: [
      { node: "trigger", type: "main", index: 0 },
      { node: "source-api", type: "main", index: 0 },
      { node: "transform", type: "main", index: 0 },
      { node: "target-api", type: "main", index: 0 },
    ],
    variables: [
      "TRIGGER_NAME",
      "TRIGGER_TYPE",
      "TRIGGER_PARAMS",
      "SOURCE_API_URL",
      "TRANSFORMATION_LOGIC",
      "TARGET_API_URL",
    ],
  },
]

export function generateWorkflow(request: WorkflowGenerationRequest): GeneratedWorkflow {
  const { description, category, triggerType, integrations = [], complexity = "Intermediate" } = request

  // Analyze the request to determine the best approach
  const analysis = analyzeWorkflowRequest(description, category, triggerType, integrations)

  // Find the most suitable template
  const template = findBestTemplate(analysis)

  // Generate the workflow based on the template and request
  const workflow = buildWorkflowFromTemplate(template, analysis, request)

  // Calculate confidence based on template match and request clarity
  const confidence = calculateGenerationConfidence(analysis, template)

  // Generate explanation and suggestions
  const explanation = generateWorkflowExplanation(workflow, template, analysis)
  const suggestions = generateWorkflowSuggestions(workflow, analysis)

  return {
    workflow,
    explanation,
    suggestions,
    confidence,
    templateUsed: [template.name],
  }
}

interface WorkflowAnalysis {
  detectedCategory: string
  detectedTrigger: string
  requiredIntegrations: string[]
  complexity: "Basic" | "Intermediate" | "Advanced"
  keywords: string[]
  intent: string
}

function analyzeWorkflowRequest(
  description: string,
  category?: string,
  triggerType?: string,
  integrations?: string[],
): WorkflowAnalysis {
  const words = description.toLowerCase().split(/\s+/)

  // Detect category from description if not provided
  const categoryKeywords = {
    notifications: ["notify", "alert", "email", "slack", "message", "send"],
    "data-processing": ["process", "transform", "csv", "data", "parse", "clean"],
    "api-integration": ["api", "connect", "sync", "integrate", "webhook"],
    automation: ["automate", "schedule", "trigger", "workflow"],
    monitoring: ["monitor", "check", "health", "status", "uptime"],
    "content-management": ["content", "publish", "newsletter", "blog", "cms"],
  }

  let detectedCategory = category || "automation"
  if (!category) {
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => words.includes(keyword))) {
        detectedCategory = cat
        break
      }
    }
  }

  // Detect trigger type from description
  const triggerKeywords = {
    webhook: ["webhook", "receive", "incoming", "post", "trigger"],
    schedule: ["daily", "weekly", "hourly", "schedule", "cron", "every"],
    manual: ["manual", "button", "click", "run"],
  }

  let detectedTrigger = triggerType || "webhook"
  if (!triggerType) {
    for (const [trigger, keywords] of Object.entries(triggerKeywords)) {
      if (keywords.some((keyword) => words.includes(keyword))) {
        detectedTrigger = trigger
        break
      }
    }
  }

  // Detect required integrations
  const integrationKeywords = {
    slack: ["slack"],
    email: ["email", "smtp", "send"],
    github: ["github", "git"],
    database: ["database", "postgres", "mysql", "store"],
    google: ["google", "drive", "sheets"],
    hubspot: ["hubspot", "crm"],
  }

  const requiredIntegrations = integrations || []
  for (const [integration, keywords] of Object.entries(integrationKeywords)) {
    if (keywords.some((keyword) => words.includes(keyword)) && !requiredIntegrations.includes(integration)) {
      requiredIntegrations.push(integration)
    }
  }

  // Determine complexity
  let complexity: "Basic" | "Intermediate" | "Advanced" = "Intermediate"
  if (words.length < 10 && requiredIntegrations.length <= 1) {
    complexity = "Basic"
  } else if (words.length > 30 || requiredIntegrations.length > 3) {
    complexity = "Advanced"
  }

  return {
    detectedCategory,
    detectedTrigger,
    requiredIntegrations,
    complexity,
    keywords: words,
    intent: description,
  }
}

function findBestTemplate(analysis: WorkflowAnalysis): WorkflowTemplate {
  // Score templates based on category match and trigger type
  const templateScores = workflowTemplates.map((template) => {
    let score = 0

    // Category match
    if (template.category.toLowerCase().includes(analysis.detectedCategory)) {
      score += 50
    }

    // Trigger type match
    const triggerNode = template.nodes.find((node) => node.type.includes("webhook") || node.type.includes("cron"))
    if (triggerNode) {
      if (analysis.detectedTrigger === "webhook" && triggerNode.type.includes("webhook")) {
        score += 30
      } else if (analysis.detectedTrigger === "schedule" && triggerNode.type.includes("cron")) {
        score += 30
      }
    }

    // Integration match
    analysis.requiredIntegrations.forEach((integration) => {
      if (template.variables.some((variable) => variable.toLowerCase().includes(integration))) {
        score += 10
      }
    })

    return { template, score }
  })

  // Return the highest scoring template, or default to the first one
  const bestMatch = templateScores.sort((a, b) => b.score - a.score)[0]
  return bestMatch.template
}

function buildWorkflowFromTemplate(
  template: WorkflowTemplate,
  analysis: WorkflowAnalysis,
  request: WorkflowGenerationRequest,
): N8nWorkflow {
  const workflowId = `generated-${Date.now()}`
  const workflowName = generateWorkflowName(analysis.intent)

  // Replace template variables with actual values
  const nodes = template.nodes.map((node) => {
    const newNode = { ...node }

    // Replace variables in node parameters
    if (typeof newNode.parameters === "object") {
      newNode.parameters = replaceTemplateVariables(newNode.parameters, analysis, request)
    }

    // Replace variables in node type
    newNode.type = replaceTemplateVariables(newNode.type, analysis, request)

    return newNode
  })

  return {
    id: workflowId,
    name: workflowName,
    description: request.description,
    category: analysis.detectedCategory.charAt(0).toUpperCase() + analysis.detectedCategory.slice(1),
    tags: generateWorkflowTags(analysis),
    nodes,
    connections: template.connections,
    version: "1.0",
    lastUpdated: new Date().toISOString().split("T")[0],
    complexity: analysis.complexity,
    author: "AI Generator",
    useCase: request.description,
    estimatedRunTime: estimateRunTime(analysis.complexity, nodes.length),
    triggerType: analysis.detectedTrigger.charAt(0).toUpperCase() + analysis.detectedTrigger.slice(1),
    nodeCount: nodes.length,
  }
}

function replaceTemplateVariables(obj: any, analysis: WorkflowAnalysis, request: WorkflowGenerationRequest): any {
  if (typeof obj === "string") {
    return obj
      .replace(/{{WEBHOOK_PATH}}/g, generateWebhookPath(analysis.intent))
      .replace(/{{NOTIFICATION_TYPE}}/g, getNotificationType(analysis.requiredIntegrations))
      .replace(/{{CHANNEL}}/g, getDefaultChannel(analysis.detectedCategory))
      .replace(/{{MESSAGE_TEMPLATE}}/g, generateMessageTemplate(analysis.intent))
      .replace(/{{CRON_SCHEDULE}}/g, generateCronSchedule(analysis.keywords))
      .replace(/{{DATA_SOURCE_TYPE}}/g, getDataSourceType(analysis.requiredIntegrations))
      .replace(/{{STORAGE_TYPE}}/g, getStorageType(analysis.requiredIntegrations))
      .replace(/{{TRIGGER_TYPE}}/g, getTriggerType(analysis.detectedTrigger))
      .replace(/{{TRIGGER_NAME}}/g, generateTriggerName(analysis.detectedTrigger))
  }

  if (typeof obj === "object" && obj !== null) {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceTemplateVariables(value, analysis, request)
    }
    return result
  }

  return obj
}

function generateWorkflowName(description: string): string {
  const words = description.split(" ").slice(0, 4)
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

function generateWorkflowTags(analysis: WorkflowAnalysis): string[] {
  const tags = [analysis.detectedCategory, analysis.detectedTrigger]
  tags.push(...analysis.requiredIntegrations)
  return [...new Set(tags)]
}

function generateWebhookPath(description: string): string {
  return description.toLowerCase().replace(/\s+/g, "-").slice(0, 20)
}

function getNotificationType(integrations: string[]): string {
  if (integrations.includes("slack")) return "slack"
  if (integrations.includes("email")) return "emailSend"
  return "slack"
}

function getDefaultChannel(category: string): string {
  const channelMap: Record<string, string> = {
    notifications: "#general",
    monitoring: "#alerts",
    "data-processing": "#data",
    "api-integration": "#integrations",
  }
  return channelMap[category] || "#general"
}

function generateMessageTemplate(description: string): string {
  return `Workflow triggered: ${description.slice(0, 50)}...`
}

function generateCronSchedule(keywords: string[]): string {
  if (keywords.includes("daily")) return "0 9 * * *"
  if (keywords.includes("weekly")) return "0 9 * * 1"
  if (keywords.includes("hourly")) return "0 * * * *"
  return "0 9 * * *" // Default to daily at 9 AM
}

function getDataSourceType(integrations: string[]): string {
  if (integrations.includes("google")) return "googleDrive"
  if (integrations.includes("database")) return "postgres"
  return "httpRequest"
}

function getStorageType(integrations: string[]): string {
  if (integrations.includes("database")) return "postgres"
  if (integrations.includes("google")) return "googleSheets"
  return "postgres"
}

function getTriggerType(triggerType: string): string {
  const typeMap: Record<string, string> = {
    webhook: "webhook",
    schedule: "cron",
    manual: "manualTrigger",
  }
  return typeMap[triggerType] || "webhook"
}

function generateTriggerName(triggerType: string): string {
  const nameMap: Record<string, string> = {
    webhook: "Webhook Trigger",
    schedule: "Schedule Trigger",
    manual: "Manual Trigger",
  }
  return nameMap[triggerType] || "Trigger"
}

function estimateRunTime(complexity: string, nodeCount: number): string {
  const baseTime = nodeCount * 2 // 2 seconds per node
  const complexityMultiplier = complexity === "Basic" ? 1 : complexity === "Intermediate" ? 1.5 : 2
  const totalSeconds = Math.round(baseTime * complexityMultiplier)

  if (totalSeconds < 60) return `${totalSeconds} seconds`
  return `${Math.round(totalSeconds / 60)} minutes`
}

function calculateGenerationConfidence(analysis: WorkflowAnalysis, template: WorkflowTemplate): number {
  let confidence = 60 // Base confidence

  // Boost confidence for clear category detection
  if (analysis.detectedCategory !== "automation") confidence += 15

  // Boost confidence for detected integrations
  confidence += Math.min(20, analysis.requiredIntegrations.length * 5)

  // Boost confidence for template match
  if (template.category.toLowerCase().includes(analysis.detectedCategory)) confidence += 15

  // Reduce confidence for very short descriptions
  if (analysis.keywords.length < 5) confidence -= 10

  return Math.max(40, Math.min(90, confidence))
}

function generateWorkflowExplanation(
  workflow: N8nWorkflow,
  template: WorkflowTemplate,
  analysis: WorkflowAnalysis,
): string {
  return `Generated a ${workflow.complexity.toLowerCase()} ${workflow.category.toLowerCase()} workflow using the "${template.name}" template. The workflow includes ${workflow.nodeCount} nodes and is triggered by ${workflow.triggerType.toLowerCase()}. It incorporates ${analysis.requiredIntegrations.length} integrations: ${analysis.requiredIntegrations.join(", ") || "none specified"}.`
}

function generateWorkflowSuggestions(workflow: N8nWorkflow, analysis: WorkflowAnalysis): string[] {
  const suggestions: string[] = []

  if (analysis.requiredIntegrations.length === 0) {
    suggestions.push("Consider adding specific integrations (Slack, email, database) for better functionality")
  }

  if (workflow.nodeCount < 3) {
    suggestions.push("Add error handling and logging nodes for production use")
  }

  if (analysis.complexity === "Basic") {
    suggestions.push("Consider adding data validation and transformation steps")
  }

  suggestions.push("Test the workflow with sample data before deploying to production")
  suggestions.push("Add monitoring and alerting for workflow failures")

  return suggestions
}
