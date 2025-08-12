"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Bot, MessageSquare, Settings, ArrowLeft, Play, Pause, Calendar, Zap, Users } from "lucide-react"
import { getAgentById, getConversationsByAgent } from "@/lib/agent-database"
import type { AIAgent, Conversation } from "@/lib/types"
import Link from "next/link"

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = params.id as string

  const [agent, setAgent] = useState<AIAgent | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAgent = () => {
      const foundAgent = getAgentById(agentId)
      const agentConversations = getConversationsByAgent(agentId)

      setAgent(foundAgent || null)
      setConversations(agentConversations)
      setIsLoading(false)
    }

    loadAgent()
  }, [agentId])

  const handleToggleActive = () => {
    if (agent) {
      setAgent({ ...agent, isActive: !agent.isActive })
      // In a real app, this would update the database
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-4"></div>
              <div className="h-12 bg-muted rounded w-96 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-muted rounded"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-48 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!agent) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Agent Not Found</h1>
              <p className="text-muted-foreground mb-6">The agent you're looking for doesn't exist.</p>
              <Button asChild>
                <Link href="/agents">Back to Agents</Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/agents">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Agents
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Agent Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${agent.isActive ? "bg-primary/10" : "bg-muted"}`}>
                        <Bot className={`h-8 w-8 ${agent.isActive ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-3">
                          {agent.name}
                          {agent.isActive ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">{agent.description}</CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{agent.category}</Badge>
                          <Badge variant="outline">{agent.model}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant={agent.isActive ? "outline" : "default"} size="sm" onClick={handleToggleActive}>
                        {agent.isActive ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button asChild>
                        <Link href={`/agents/${agent.id}/chat`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Agent Details Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="prompt">System Prompt</TabsTrigger>
                  <TabsTrigger value="conversations">Conversations</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Capabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {agent.capabilities.map((capability) => (
                          <Badge key={capability} variant="secondary">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {agent.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {agent.examples.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Example Use Cases</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {agent.examples.map((example) => (
                          <div key={example.id} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">{example.title}</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium text-muted-foreground">User:</span>
                                <p className="mt-1">{example.userMessage}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Expected Response:</span>
                                <p className="mt-1">{example.expectedResponse}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="prompt">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Prompt</CardTitle>
                      <CardDescription>
                        The system prompt defines how this agent behaves and responds to users
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {agent.systemPrompt}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="conversations">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Conversations</CardTitle>
                      <CardDescription>
                        {conversations.length} conversation{conversations.length !== 1 ? "s" : ""} with this agent
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {conversations.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No conversations yet</p>
                          <Button asChild className="mt-4">
                            <Link href={`/agents/${agent.id}/chat`}>Start First Conversation</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {conversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div>
                                <h4 className="font-medium">{conversation.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {conversation.messages.length} messages • {formatDate(conversation.updatedAt)}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/agents/${agent.id}/chat?conversation=${conversation.id}`}>View</Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Model Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Model</label>
                          <p className="text-sm text-muted-foreground">{agent.model}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Temperature</label>
                          <p className="text-sm text-muted-foreground">{agent.temperature}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Max Tokens</label>
                          <p className="text-sm text-muted-foreground">{agent.maxTokens}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Status</label>
                          <p className="text-sm text-muted-foreground">{agent.isActive ? "Active" : "Inactive"}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Configuration
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Agent Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Conversations</span>
                    </div>
                    <span className="font-medium">{agent.conversationCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Created</span>
                    </div>
                    <span className="font-medium">{formatDate(agent.createdAt)}</span>
                  </div>
                  {agent.lastUsed && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Last Used</span>
                      </div>
                      <span className="font-medium">{formatDate(agent.lastUsed)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full justify-start">
                    <Link href={`/agents/${agent.id}/chat`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start New Chat
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Agent
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Share Agent
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
