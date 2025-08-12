"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navigation } from "@/components/navigation"
import { MessageBubble } from "@/components/message-bubble"
import { ChatInput } from "@/components/chat-input"
import { Bot, ArrowLeft, AlertCircle, Trash2, Download } from "lucide-react"
import { getAgentById } from "@/lib/agent-database"
import { useAgentChat } from "@/hooks/use-agent-chat"
import type { AIAgent } from "@/lib/types"
import Link from "next/link"

export default function AgentChatPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const agentId = params.id as string
  const conversationId = searchParams.get("conversation")

  const [agent, setAgent] = useState<AIAgent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadAgent = () => {
      const foundAgent = getAgentById(agentId)
      setAgent(foundAgent || null)
      setIsLoading(false)
    }

    loadAgent()
  }, [agentId])

  const {
    messages,
    isLoading: isChatLoading,
    error,
    sendMessage,
    clearMessages,
    clearError,
  } = useAgentChat({
    agent: agent!,
    initialMessages: [], // In a real app, load from conversation history
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleExportChat = () => {
    const chatData = {
      agent: agent?.name,
      timestamp: new Date().toISOString(),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-${agent?.name}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-4"></div>
              <div className="h-96 bg-muted rounded"></div>
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
              <p className="text-muted-foreground mb-6">The agent you're trying to chat with doesn't exist.</p>
              <Button asChild>
                <Link href="/agents">Back to Agents</Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!agent.isActive) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/agents/${agent.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Agent
                </Link>
              </Button>
            </div>

            <div className="text-center py-12">
              <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Agent Inactive</h1>
              <p className="text-muted-foreground mb-6">
                This agent is currently inactive. Please activate it to start chatting.
              </p>
              <Button asChild>
                <Link href={`/agents/${agent.id}`}>View Agent Details</Link>
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/agents/${agent.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Agent
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <Bot className="h-6 w-6 text-primary" />
                  Chat with {agent.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{agent.category}</Badge>
                  <Badge variant="outline">{agent.model}</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {messages.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={handleExportChat}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearMessages}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </>
              )}
            </div>
          </div>

          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="flex-shrink-0 border-b">
              <CardTitle className="text-lg">Conversation</CardTitle>
              {conversationId && <p className="text-sm text-muted-foreground">Conversation ID: {conversationId}</p>}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="m-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    {error}
                    <Button variant="ghost" size="sm" onClick={clearError}>
                      Dismiss
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                    <p className="text-muted-foreground mb-4">
                      Ask {agent.name} anything! This agent specializes in {agent.category.toLowerCase()}.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {agent.capabilities.slice(0, 3).map((capability) => (
                        <Badge key={capability} variant="secondary">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isStreaming={isChatLoading && index === messages.length - 1 && message.role === "assistant"}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Chat Input */}
              <ChatInput
                onSendMessage={sendMessage}
                isLoading={isChatLoading}
                placeholder={`Message ${agent.name}...`}
                disabled={!agent.isActive}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
