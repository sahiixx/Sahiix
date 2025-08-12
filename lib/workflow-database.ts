import type { WorkflowCategory } from "./types"

export interface WorkflowNode {
  id: string
  name: string
  type: string
  typeVersion: number
  position: [number, number]
  parameters: any
  credentials?: Record<string, string>
}

export interface N8nWorkflow {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  nodes: WorkflowNode[]
  connections: any[]
  version: string
  lastUpdated: string
  complexity: "Basic" | "Intermediate" | "Advanced"
  author: string
  useCase: string
  estimatedRunTime: string
  triggerType: string
  nodeCount: number
}

export const workflowCategories: WorkflowCategory[] = [
  {
    id: "data-processing",
    name: "Data Processing",
    description: "ETL, data transformation, and analysis workflows",
    count: 12,
    icon: "database",
  },
  {
    id: "api-integration",
    name: "API Integration",
    description: "Connect and sync data between different services",
    count: 8,
    icon: "link",
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Automated alerts, emails, and messaging workflows",
    count: 15,
    icon: "bell",
  },
  {
    id: "content-management",
    name: "Content Management",
    description: "Automated content creation and publishing",
    count: 6,
    icon: "file-text",
  },
  {
    id: "automation",
    name: "Automation",
    description: "General automation and task scheduling workflows",
    count: 10,
    icon: "zap",
  },
  {
    id: "monitoring",
    name: "Monitoring",
    description: "System monitoring and alerting workflows",
    count: 7,
    icon: "activity",
  },
]

export const workflows: N8nWorkflow[] = [
  {
    id: "slack-github-integration",
    name: "Slack GitHub Integration",
    description:
      "Automatically post GitHub repository updates to Slack channels with formatted messages and relevant team mentions.",
    category: "Notifications",
    tags: ["slack", "github", "notifications", "team-collaboration"],
    nodes: [
      {
        id: "webhook",
        name: "GitHub Webhook",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [250, 300],
        parameters: {
          httpMethod: "POST",
          path: "github-webhook",
          responseMode: "onReceived",
        },
      },
      {
        id: "filter",
        name: "Filter Events",
        type: "n8n-nodes-base.if",
        typeVersion: 1,
        position: [450, 300],
        parameters: {
          conditions: {
            string: [
              {
                value1: "={{$json.action}}",
                operation: "equal",
                value2: "opened",
              },
            ],
          },
        },
      },
      {
        id: "slack",
        name: "Post to Slack",
        type: "n8n-nodes-base.slack",
        typeVersion: 1,
        position: [650, 300],
        parameters: {
          channel: "#development",
          text: "New PR: {{$json.pull_request.title}} by {{$json.pull_request.user.login}}",
        },
        credentials: {
          slackApi: "slack_credentials",
        },
      },
    ],
    connections: [
      { node: "webhook", type: "main", index: 0 },
      { node: "filter", type: "main", index: 0 },
      { node: "slack", type: "main", index: 0 },
    ],
    version: "1.0",
    lastUpdated: "2024-01-15",
    complexity: "Intermediate",
    author: "DevOps Team",
    useCase: "Keep development team informed about repository activities in real-time",
    estimatedRunTime: "< 5 seconds",
    triggerType: "Webhook",
    nodeCount: 3,
  },
  {
    id: "csv-data-processing",
    name: "CSV Data Processing",
    description:
      "Process CSV files from Google Drive, clean data, perform calculations, and save results to database with error handling.",
    category: "Data Processing",
    tags: ["csv", "google-drive", "database", "data-cleaning"],
    nodes: [
      {
        id: "schedule",
        name: "Daily Schedule",
        type: "n8n-nodes-base.cron",
        typeVersion: 1,
        position: [250, 300],
        parameters: {
          rule: {
            hour: 9,
            minute: 0,
          },
        },
      },
      {
        id: "google-drive",
        name: "Get CSV Files",
        type: "n8n-nodes-base.googleDrive",
        typeVersion: 1,
        position: [450, 300],
        parameters: {
          operation: "list",
          folderId: "1ABC123DEF456",
          filters: {
            name: "*.csv",
          },
        },
        credentials: {
          googleDriveOAuth2: "google_drive_credentials",
        },
      },
      {
        id: "csv-parser",
        name: "Parse CSV",
        type: "n8n-nodes-base.spreadsheetFile",
        typeVersion: 1,
        position: [650, 300],
        parameters: {
          operation: "read",
          options: {
            headerRow: true,
          },
        },
      },
      {
        id: "data-transform",
        name: "Transform Data",
        type: "n8n-nodes-base.function",
        typeVersion: 1,
        position: [850, 300],
        parameters: {
          functionCode: `
            const items = $input.all();
            return items.map(item => ({
              ...item.json,
              processed_date: new Date().toISOString(),
              total: parseFloat(item.json.amount) * parseFloat(item.json.quantity)
            }));
          `,
        },
      },
      {
        id: "database",
        name: "Save to Database",
        type: "n8n-nodes-base.postgres",
        typeVersion: 1,
        position: [1050, 300],
        parameters: {
          operation: "insert",
          table: "processed_data",
          columns: "name,amount,quantity,total,processed_date",
        },
        credentials: {
          postgres: "postgres_credentials",
        },
      },
    ],
    connections: [
      { node: "schedule", type: "main", index: 0 },
      { node: "google-drive", type: "main", index: 0 },
      { node: "csv-parser", type: "main", index: 0 },
      { node: "data-transform", type: "main", index: 0 },
      { node: "database", type: "main", index: 0 },
    ],
    version: "2.1",
    lastUpdated: "2024-01-20",
    complexity: "Advanced",
    author: "Data Team",
    useCase: "Automated daily processing of sales data from CSV files with validation and storage",
    estimatedRunTime: "2-5 minutes",
    triggerType: "Schedule",
    nodeCount: 5,
  },
  {
    id: "newsletter-automation",
    name: "Newsletter Automation",
    description:
      "Automatically create and send weekly newsletters by aggregating content from multiple sources and personalizing for different subscriber segments.",
    category: "Content Management",
    tags: ["email", "newsletter", "content-aggregation", "personalization"],
    nodes: [
      {
        id: "weekly-trigger",
        name: "Weekly Trigger",
        type: "n8n-nodes-base.cron",
        typeVersion: 1,
        position: [250, 300],
        parameters: {
          rule: {
            dayOfWeek: 1,
            hour: 10,
            minute: 0,
          },
        },
      },
      {
        id: "rss-feed",
        name: "Fetch RSS Content",
        type: "n8n-nodes-base.rssFeedRead",
        typeVersion: 1,
        position: [450, 300],
        parameters: {
          url: "https://blog.company.com/feed.xml",
        },
      },
      {
        id: "content-filter",
        name: "Filter Recent Content",
        type: "n8n-nodes-base.function",
        typeVersion: 1,
        position: [650, 300],
        parameters: {
          functionCode: `
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            return $input.all().filter(item => 
              new Date(item.json.pubDate) > oneWeekAgo
            ).slice(0, 5);
          `,
        },
      },
      {
        id: "template-builder",
        name: "Build Email Template",
        type: "n8n-nodes-base.function",
        typeVersion: 1,
        position: [850, 300],
        parameters: {
          functionCode: `
            const articles = $input.all();
            const html = articles.map(article => 
              \`<div><h3>\${article.json.title}</h3><p>\${article.json.description}</p></div>\`
            ).join('');
            
            return [{
              json: {
                subject: 'Weekly Newsletter - ' + new Date().toLocaleDateString(),
                html: \`<html><body><h1>This Week's Updates</h1>\${html}</body></html>\`
              }
            }];
          `,
        },
      },
      {
        id: "send-email",
        name: "Send Newsletter",
        type: "n8n-nodes-base.emailSend",
        typeVersion: 1,
        position: [1050, 300],
        parameters: {
          fromEmail: "newsletter@company.com",
          toEmail: "subscribers@company.com",
          subject: "={{$json.subject}}",
          html: "={{$json.html}}",
        },
        credentials: {
          smtp: "email_credentials",
        },
      },
    ],
    connections: [
      { node: "weekly-trigger", type: "main", index: 0 },
      { node: "rss-feed", type: "main", index: 0 },
      { node: "content-filter", type: "main", index: 0 },
      { node: "template-builder", type: "main", index: 0 },
      { node: "send-email", type: "main", index: 0 },
    ],
    version: "1.3",
    lastUpdated: "2024-01-18",
    complexity: "Intermediate",
    author: "Marketing Team",
    useCase: "Automated weekly newsletter generation and distribution to subscriber base",
    estimatedRunTime: "1-2 minutes",
    triggerType: "Schedule",
    nodeCount: 5,
  },
]

export function getWorkflowById(id: string): N8nWorkflow | undefined {
  return workflows.find((workflow) => workflow.id === id)
}

export function getWorkflowsByCategory(category: string): N8nWorkflow[] {
  return workflows.filter((workflow) => workflow.category.toLowerCase() === category.toLowerCase())
}

export function searchWorkflows(query: string): N8nWorkflow[] {
  const searchTerm = query.toLowerCase()
  return workflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchTerm) ||
      workflow.description.toLowerCase().includes(searchTerm) ||
      workflow.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
  )
}

export function getUniqueWorkflowCategories(): string[] {
  return Array.from(new Set(workflows.map((workflow) => workflow.category)))
}

export function getUniqueWorkflowTags(): string[] {
  return Array.from(new Set(workflows.flatMap((workflow) => workflow.tags)))
}

export function getAllWorkflowTags(): string[] {
  return getUniqueWorkflowTags()
}
