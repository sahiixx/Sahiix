import type { Team, TeamMember, SharedResource, Activity, Workspace } from "./types"

export const teams: Team[] = [
  {
    id: "team-1",
    name: "AI Development Team",
    description: "Collaborative workspace for AI tool development and automation",
    avatar: "/team-avatar.png",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-01T15:30:00Z",
    memberCount: 8,
    plan: "Pro",
    settings: {
      allowPublicSharing: true,
      requireApprovalForSharing: false,
      defaultVisibility: "Team",
      allowExternalCollaborators: true,
    },
  },
  {
    id: "team-2",
    name: "Automation Specialists",
    description: "Expert team focused on workflow automation and n8n integrations",
    avatar: "/automation-team.png",
    createdAt: "2024-02-20T14:00:00Z",
    updatedAt: "2024-11-28T09:15:00Z",
    memberCount: 5,
    plan: "Enterprise",
    settings: {
      allowPublicSharing: false,
      requireApprovalForSharing: true,
      defaultVisibility: "Private",
      allowExternalCollaborators: false,
    },
  },
]

export const teamMembers: TeamMember[] = [
  {
    id: "member-1",
    teamId: "team-1",
    userId: "user-1",
    email: "alice@example.com",
    name: "Alice Johnson",
    avatar: "/alice-avatar.png",
    role: "Owner",
    joinedAt: "2024-01-15T10:00:00Z",
    lastActive: "2024-12-01T16:45:00Z",
    permissions: {
      canCreatePrompts: true,
      canEditPrompts: true,
      canDeletePrompts: true,
      canCreateWorkflows: true,
      canEditWorkflows: true,
      canDeleteWorkflows: true,
      canCreateAgents: true,
      canEditAgents: true,
      canDeleteAgents: true,
      canManageTeam: true,
      canInviteMembers: true,
      canManageIntegrations: true,
    },
  },
  {
    id: "member-2",
    teamId: "team-1",
    userId: "user-2",
    email: "bob@example.com",
    name: "Bob Smith",
    avatar: "/bob-avatar.png",
    role: "Admin",
    joinedAt: "2024-01-20T11:30:00Z",
    lastActive: "2024-12-01T14:20:00Z",
    permissions: {
      canCreatePrompts: true,
      canEditPrompts: true,
      canDeletePrompts: true,
      canCreateWorkflows: true,
      canEditWorkflows: true,
      canDeleteWorkflows: true,
      canCreateAgents: true,
      canEditAgents: true,
      canDeleteAgents: false,
      canManageTeam: true,
      canInviteMembers: true,
      canManageIntegrations: true,
    },
  },
]

export const sharedResources: SharedResource[] = [
  {
    id: "shared-1",
    resourceId: "prompt-1",
    resourceType: "prompt",
    title: "Advanced Code Generation Prompt",
    description: "Optimized prompt for generating high-quality React components",
    sharedBy: "user-1",
    sharedWith: ["team-1", "team-2"],
    visibility: "Team",
    permissions: {
      canView: true,
      canEdit: true,
      canComment: true,
      canShare: false,
      canFork: true,
    },
    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-11-28T14:30:00Z",
    accessCount: 45,
    tags: ["react", "code-generation", "prompt-engineering"],
  },
]

export const activities: Activity[] = [
  {
    id: "activity-1",
    teamId: "team-1",
    userId: "user-1",
    userName: "Alice Johnson",
    userAvatar: "/alice-avatar.png",
    action: "created",
    resourceType: "prompt",
    resourceId: "prompt-1",
    resourceTitle: "Advanced Code Generation Prompt",
    description: "Created a new prompt for React component generation",
    timestamp: "2024-12-01T10:30:00Z",
    metadata: { category: "Code Generation", complexity: "Advanced" },
  },
  {
    id: "activity-2",
    teamId: "team-1",
    userId: "user-2",
    userName: "Bob Smith",
    userAvatar: "/bob-avatar.png",
    action: "shared",
    resourceType: "workflow",
    resourceId: "workflow-1",
    resourceTitle: "API Integration Workflow",
    description: "Shared workflow with the team",
    timestamp: "2024-12-01T14:15:00Z",
    metadata: { visibility: "Team", permissions: "Edit" },
  },
]

export const workspaces: Workspace[] = [
  {
    id: "workspace-1",
    name: "AI Prompt Collection",
    description: "Curated collection of high-performing AI prompts",
    teamId: "team-1",
    createdBy: "user-1",
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-12-01T16:00:00Z",
    isArchived: false,
    resources: [
      {
        id: "resource-1",
        resourceId: "prompt-1",
        resourceType: "prompt",
        addedAt: "2024-11-01T09:30:00Z",
        addedBy: "user-1",
        position: { x: 100, y: 100 },
        notes: "Primary prompt for code generation tasks",
      },
    ],
    collaborators: ["user-1", "user-2"],
    settings: {
      isPublic: false,
      allowComments: true,
      allowForking: true,
      requireApproval: false,
    },
  },
]

export function getTeams(): Team[] {
  return teams
}

export function getTeamById(id: string): Team | undefined {
  return teams.find((team) => team.id === id)
}

export function getTeamMembers(teamId: string): TeamMember[] {
  return teamMembers.filter((member) => member.teamId === teamId)
}

export function getSharedResources(teamId?: string): SharedResource[] {
  if (teamId) {
    return sharedResources.filter((resource) => resource.sharedWith.includes(teamId))
  }
  return sharedResources
}

export function getTeamActivities(teamId: string): Activity[] {
  return activities.filter((activity) => activity.teamId === teamId)
}

export function getWorkspaces(teamId?: string): Workspace[] {
  if (teamId) {
    return workspaces.filter((workspace) => workspace.teamId === teamId)
  }
  return workspaces
}

export function getUserTeams(userId: string): Team[] {
  const userTeamIds = teamMembers.filter((member) => member.userId === userId).map((member) => member.teamId)

  return teams.filter((team) => userTeamIds.includes(team.id))
}
