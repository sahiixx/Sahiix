import type { Integration, IntegrationConnection, WebhookEvent, SyncLog } from "./types"

export const integrations: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Connect repositories, manage issues, and sync code changes",
    category: "Development",
    provider: "GitHub Inc.",
    logo: "/placeholder.svg?height=40&width=40&text=GH",
    status: "Available",
    isPopular: true,
    features: ["Repository sync", "Issue tracking", "Pull request automation", "Code analysis"],
    supportedActions: [
      {
        id: "create-issue",
        name: "Create Issue",
        description: "Create a new issue in a repository",
        type: "action",
        parameters: [
          { name: "repository", type: "string", required: true, description: "Repository name" },
          { name: "title", type: "string", required: true, description: "Issue title" },
          { name: "body", type: "string", required: false, description: "Issue description" },
        ],
        examples: [
          {
            name: "Bug Report",
            description: "Create a bug report issue",
            parameters: { repository: "my-repo", title: "Bug found", body: "Description of the bug" },
            expectedResult: "Issue created successfully",
          },
        ],
      },
    ],
    authType: "OAuth",
    setupComplexity: "Easy",
    documentation: "https://docs.github.com/en/rest",
    syncStatus: "Never",
    connectionCount: 1247,
    usageCount: 5678,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send messages, manage channels, and automate team communication",
    category: "Communication",
    provider: "Slack Technologies",
    logo: "/placeholder.svg?height=40&width=40&text=SL",
    status: "Available",
    isPopular: true,
    features: ["Message automation", "Channel management", "User notifications", "File sharing"],
    supportedActions: [
      {
        id: "send-message",
        name: "Send Message",
        description: "Send a message to a Slack channel",
        type: "action",
        parameters: [
          { name: "channel", type: "string", required: true, description: "Channel name or ID" },
          { name: "text", type: "string", required: true, description: "Message text" },
          { name: "username", type: "string", required: false, description: "Bot username" },
        ],
        examples: [
          {
            name: "Notification",
            description: "Send a notification message",
            parameters: { channel: "#general", text: "Deployment completed successfully!" },
            expectedResult: "Message sent to #general",
          },
        ],
      },
    ],
    authType: "OAuth",
    setupComplexity: "Easy",
    documentation: "https://api.slack.com/",
    syncStatus: "Never",
    connectionCount: 892,
    usageCount: 3456,
  },
  {
    id: "discord",
    name: "Discord",
    description: "Manage servers, send messages, and automate community interactions",
    category: "Communication",
    provider: "Discord Inc.",
    logo: "/placeholder.svg?height=40&width=40&text=DC",
    status: "Available",
    isPopular: true,
    features: ["Server management", "Message automation", "Role management", "Voice channel control"],
    supportedActions: [
      {
        id: "send-webhook",
        name: "Send Webhook Message",
        description: "Send a message via Discord webhook",
        type: "action",
        parameters: [
          { name: "webhook_url", type: "string", required: true, description: "Discord webhook URL" },
          { name: "content", type: "string", required: true, description: "Message content" },
          { name: "username", type: "string", required: false, description: "Bot username" },
        ],
        examples: [
          {
            name: "Alert",
            description: "Send an alert message",
            parameters: { webhook_url: "https://discord.com/api/webhooks/...", content: "Alert: System status update" },
            expectedResult: "Message sent to Discord channel",
          },
        ],
      },
    ],
    authType: "Webhook",
    setupComplexity: "Easy",
    documentation: "https://discord.com/developers/docs",
    syncStatus: "Never",
    connectionCount: 567,
    usageCount: 2134,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync databases, create pages, and manage workspace content",
    category: "Productivity",
    provider: "Notion Labs",
    logo: "/placeholder.svg?height=40&width=40&text=NO",
    status: "Available",
    isPopular: true,
    features: ["Database sync", "Page creation", "Content management", "Team collaboration"],
    supportedActions: [
      {
        id: "create-page",
        name: "Create Page",
        description: "Create a new page in Notion",
        type: "action",
        parameters: [
          { name: "parent_id", type: "string", required: true, description: "Parent page or database ID" },
          { name: "title", type: "string", required: true, description: "Page title" },
          { name: "content", type: "object", required: false, description: "Page content blocks" },
        ],
        examples: [
          {
            name: "Meeting Notes",
            description: "Create a meeting notes page",
            parameters: { parent_id: "abc123", title: "Weekly Team Meeting", content: {} },
            expectedResult: "Page created in Notion workspace",
          },
        ],
      },
    ],
    authType: "OAuth",
    setupComplexity: "Medium",
    documentation: "https://developers.notion.com/",
    syncStatus: "Never",
    connectionCount: 423,
    usageCount: 1876,
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Manage files, folders, and collaborate on documents",
    category: "Storage",
    provider: "Google LLC",
    logo: "/placeholder.svg?height=40&width=40&text=GD",
    status: "Available",
    isPopular: false,
    features: ["File management", "Folder sync", "Document collaboration", "Permission control"],
    supportedActions: [
      {
        id: "upload-file",
        name: "Upload File",
        description: "Upload a file to Google Drive",
        type: "action",
        parameters: [
          { name: "file", type: "file", required: true, description: "File to upload" },
          { name: "folder_id", type: "string", required: false, description: "Destination folder ID" },
          { name: "name", type: "string", required: false, description: "File name" },
        ],
        examples: [
          {
            name: "Backup Upload",
            description: "Upload a backup file",
            parameters: { file: "backup.zip", folder_id: "folder123", name: "daily-backup.zip" },
            expectedResult: "File uploaded to Google Drive",
          },
        ],
      },
    ],
    authType: "OAuth",
    setupComplexity: "Medium",
    documentation: "https://developers.google.com/drive",
    syncStatus: "Never",
    connectionCount: 234,
    usageCount: 987,
  },
  {
    id: "trello",
    name: "Trello",
    description: "Manage boards, cards, and project workflows",
    category: "Productivity",
    provider: "Atlassian",
    logo: "/placeholder.svg?height=40&width=40&text=TR",
    status: "Available",
    isPopular: false,
    features: ["Board management", "Card automation", "List organization", "Team collaboration"],
    supportedActions: [
      {
        id: "create-card",
        name: "Create Card",
        description: "Create a new card in a Trello list",
        type: "action",
        parameters: [
          { name: "list_id", type: "string", required: true, description: "List ID" },
          { name: "name", type: "string", required: true, description: "Card name" },
          { name: "desc", type: "string", required: false, description: "Card description" },
        ],
        examples: [
          {
            name: "Task Card",
            description: "Create a new task card",
            parameters: { list_id: "list123", name: "Review PR", desc: "Review the latest pull request" },
            expectedResult: "Card created in Trello list",
          },
        ],
      },
    ],
    authType: "API Key",
    setupComplexity: "Easy",
    documentation: "https://developer.atlassian.com/cloud/trello/",
    syncStatus: "Never",
    connectionCount: 156,
    usageCount: 654,
  },
]

export const connections: IntegrationConnection[] = [
  {
    id: "conn-1",
    integrationId: "github",
    userId: "user-1",
    teamId: "team-1",
    name: "My GitHub Account",
    status: "Active",
    credentials: { access_token: "ghp_xxxxxxxxxxxx" },
    settings: {
      autoSync: true,
      syncInterval: 3600,
      notifications: true,
      webhookEnabled: true,
      customFields: { repositories: ["repo1", "repo2"] },
    },
    createdAt: "2024-11-01T10:00:00Z",
    lastUsed: "2024-12-01T15:30:00Z",
    usageCount: 234,
  },
  {
    id: "conn-2",
    integrationId: "slack",
    userId: "user-1",
    teamId: "team-1",
    name: "Team Slack Workspace",
    status: "Active",
    credentials: { bot_token: "xoxb-xxxxxxxxxxxx" },
    settings: {
      autoSync: false,
      syncInterval: 0,
      notifications: true,
      webhookEnabled: false,
      customFields: { channels: ["#general", "#dev"] },
    },
    createdAt: "2024-11-15T14:00:00Z",
    lastUsed: "2024-12-01T16:45:00Z",
    usageCount: 156,
  },
]

export const webhookEvents: WebhookEvent[] = [
  {
    id: "event-1",
    integrationId: "github",
    connectionId: "conn-1",
    event: "push",
    payload: { repository: "my-repo", branch: "main", commits: 3 },
    timestamp: "2024-12-01T16:30:00Z",
    status: "Processed",
    retryCount: 0,
  },
]

export const syncLogs: SyncLog[] = [
  {
    id: "sync-1",
    connectionId: "conn-1",
    type: "Sync",
    status: "Success",
    recordsProcessed: 45,
    recordsFailed: 0,
    startTime: "2024-12-01T15:00:00Z",
    endTime: "2024-12-01T15:02:30Z",
  },
]

export function getIntegrations(): Integration[] {
  return integrations
}

export function getIntegrationById(id: string): Integration | undefined {
  return integrations.find((integration) => integration.id === id)
}

export function getPopularIntegrations(): Integration[] {
  return integrations.filter((integration) => integration.isPopular)
}

export function getIntegrationsByCategory(category: string): Integration[] {
  return integrations.filter((integration) => integration.category === category)
}

export function getConnections(userId?: string, teamId?: string): IntegrationConnection[] {
  return connections.filter((conn) => (!userId || conn.userId === userId) && (!teamId || conn.teamId === teamId))
}

export function getConnectionById(id: string): IntegrationConnection | undefined {
  return connections.find((conn) => conn.id === id)
}

export function getWebhookEvents(connectionId?: string): WebhookEvent[] {
  return webhookEvents.filter((event) => !connectionId || event.connectionId === connectionId)
}

export function getSyncLogs(connectionId?: string): SyncLog[] {
  return syncLogs.filter((log) => !connectionId || log.connectionId === connectionId)
}

export function getIntegrationCategories(): string[] {
  return Array.from(new Set(integrations.map((integration) => integration.category)))
}
