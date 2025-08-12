import type { APIService, APIIntegration } from "./types"

export const apiServices: APIService[] = [
  {
    id: "openai-api",
    name: "OpenAI API",
    description: "Access to GPT models, DALL-E, Whisper, and other AI capabilities",
    category: "AI/ML",
    provider: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    authType: "Bearer Token",
    pricing: "Paid",
    rateLimit: "3,500 RPM",
    documentation: "https://platform.openai.com/docs",
    endpoints: [
      {
        id: "chat-completions",
        name: "Chat Completions",
        method: "POST",
        path: "/chat/completions",
        description: "Generate chat completions using GPT models",
        parameters: [
          { name: "model", type: "string", required: true, description: "Model to use", example: "gpt-4" },
          { name: "messages", type: "array", required: true, description: "Chat messages", example: [] },
          { name: "temperature", type: "number", required: false, description: "Sampling temperature", example: 0.7 },
        ],
        responseSchema: { choices: [], usage: {} },
        examples: [
          {
            name: "Simple Chat",
            request: { model: "gpt-4", messages: [{ role: "user", content: "Hello!" }] },
            response: { choices: [{ message: { content: "Hello! How can I help you today?" } }] },
            description: "Basic chat completion",
          },
        ],
        requiresAuth: true,
      },
    ],
    tags: ["AI", "Chat", "GPT", "Language Model"],
    popularity: 95,
    lastUpdated: "2024-12-01",
    status: "Active",
    integrationComplexity: "Easy",
  },
  {
    id: "stripe-api",
    name: "Stripe API",
    description: "Complete payment processing and financial infrastructure",
    category: "Payment",
    provider: "Stripe",
    baseUrl: "https://api.stripe.com/v1",
    authType: "Bearer Token",
    pricing: "Freemium",
    rateLimit: "100 RPS",
    documentation: "https://stripe.com/docs/api",
    endpoints: [
      {
        id: "create-payment-intent",
        name: "Create Payment Intent",
        method: "POST",
        path: "/payment_intents",
        description: "Create a payment intent for processing payments",
        parameters: [
          { name: "amount", type: "number", required: true, description: "Amount in cents", example: 2000 },
          { name: "currency", type: "string", required: true, description: "Currency code", example: "usd" },
        ],
        responseSchema: { id: "", client_secret: "", status: "" },
        examples: [
          {
            name: "Basic Payment",
            request: { amount: 2000, currency: "usd" },
            response: { id: "pi_123", client_secret: "pi_123_secret", status: "requires_payment_method" },
            description: "Create a $20 payment intent",
          },
        ],
        requiresAuth: true,
      },
    ],
    tags: ["Payment", "E-commerce", "Billing", "Subscription"],
    popularity: 88,
    lastUpdated: "2024-11-28",
    status: "Active",
    integrationComplexity: "Medium",
  },
  {
    id: "github-api",
    name: "GitHub API",
    description: "Access GitHub repositories, issues, pull requests, and more",
    category: "Productivity",
    provider: "GitHub",
    baseUrl: "https://api.github.com",
    authType: "Bearer Token",
    pricing: "Freemium",
    rateLimit: "5,000/hour",
    documentation: "https://docs.github.com/en/rest",
    endpoints: [
      {
        id: "list-repos",
        name: "List Repositories",
        method: "GET",
        path: "/user/repos",
        description: "List repositories for the authenticated user",
        parameters: [
          {
            name: "visibility",
            type: "string",
            required: false,
            description: "Repository visibility",
            enum: ["all", "public", "private"],
          },
          {
            name: "sort",
            type: "string",
            required: false,
            description: "Sort order",
            enum: ["created", "updated", "pushed", "full_name"],
          },
        ],
        responseSchema: { name: "", full_name: "", private: false },
        examples: [
          {
            name: "List Public Repos",
            request: { visibility: "public", sort: "updated" },
            response: [{ name: "my-repo", full_name: "user/my-repo", private: false }],
            description: "Get public repositories sorted by update date",
          },
        ],
        requiresAuth: true,
      },
    ],
    tags: ["Git", "Repository", "Code", "Collaboration"],
    popularity: 92,
    lastUpdated: "2024-12-05",
    status: "Active",
    integrationComplexity: "Easy",
  },
  {
    id: "slack-api",
    name: "Slack API",
    description: "Send messages, manage channels, and integrate with Slack workspaces",
    category: "Communication",
    provider: "Slack",
    baseUrl: "https://slack.com/api",
    authType: "Bearer Token",
    pricing: "Freemium",
    rateLimit: "Tier-based",
    documentation: "https://api.slack.com/",
    endpoints: [
      {
        id: "post-message",
        name: "Post Message",
        method: "POST",
        path: "/chat.postMessage",
        description: "Send a message to a Slack channel",
        parameters: [
          { name: "channel", type: "string", required: true, description: "Channel ID or name", example: "#general" },
          { name: "text", type: "string", required: true, description: "Message text", example: "Hello, world!" },
        ],
        responseSchema: { ok: true, channel: "", ts: "" },
        examples: [
          {
            name: "Simple Message",
            request: { channel: "#general", text: "Hello from the API!" },
            response: { ok: true, channel: "C1234567890", ts: "1234567890.123456" },
            description: "Send a basic text message",
          },
        ],
        requiresAuth: true,
      },
    ],
    tags: ["Chat", "Messaging", "Team", "Notifications"],
    popularity: 85,
    lastUpdated: "2024-11-30",
    status: "Active",
    integrationComplexity: "Easy",
  },
]

export const apiIntegrations: APIIntegration[] = [
  {
    id: "openai-chat-agent",
    apiId: "openai-api",
    name: "OpenAI Chat Agent",
    description: "Create AI agents powered by OpenAI's GPT models",
    agentTemplate: "openai-assistant",
    setupInstructions: [
      "Get your OpenAI API key from platform.openai.com",
      "Add the key to your environment variables as OPENAI_API_KEY",
      "Configure your preferred model and parameters",
    ],
    requiredCredentials: ["OPENAI_API_KEY"],
    isPopular: true,
  },
  {
    id: "stripe-payment-workflow",
    apiId: "stripe-api",
    name: "Payment Processing Workflow",
    description: "Automate payment processing and invoice generation",
    workflowTemplate: "stripe-payments",
    setupInstructions: [
      "Create a Stripe account and get your API keys",
      "Add STRIPE_SECRET_KEY to environment variables",
      "Configure webhook endpoints for payment events",
    ],
    requiredCredentials: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    isPopular: true,
  },
]

export function getAPIServices(): APIService[] {
  return apiServices
}

export function getAPIServiceById(id: string): APIService | undefined {
  return apiServices.find((service) => service.id === id)
}

export function getAPIsByCategory(category: string): APIService[] {
  return apiServices.filter((service) => service.category === category)
}

export function searchAPIs(query: string): APIService[] {
  const lowercaseQuery = query.toLowerCase()
  return apiServices.filter(
    (service) =>
      service.name.toLowerCase().includes(lowercaseQuery) ||
      service.description.toLowerCase().includes(lowercaseQuery) ||
      service.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getPopularAPIs(): APIService[] {
  return apiServices.sort((a, b) => b.popularity - a.popularity).slice(0, 6)
}

export function getAPICategories(): string[] {
  return Array.from(new Set(apiServices.map((service) => service.category)))
}

export function getAPIIntegrations(): APIIntegration[] {
  return apiIntegrations
}

export function getIntegrationsByAPI(apiId: string): APIIntegration[] {
  return apiIntegrations.filter((integration) => integration.apiId === apiId)
}
