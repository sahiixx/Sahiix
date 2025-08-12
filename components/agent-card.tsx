"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, MessageSquare, Calendar, Settings, Play, Pause } from "lucide-react"
import type { AIAgent } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AgentCardProps {
  agent: AIAgent
  onToggleActive?: (agentId: string) => void
  showActions?: boolean
}

export function AgentCard({ agent, onToggleActive, showActions = true }: AgentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200", !agent.isActive && "opacity-75")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", agent.isActive ? "bg-primary/10" : "bg-muted")}>
              <Bot className={cn("h-5 w-5", agent.isActive ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {agent.name}
                {agent.isActive ? (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Inactive
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {agent.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {agent.model}
                </Badge>
              </div>
            </div>
          </div>
          {showActions && onToggleActive && (
            <Button variant="ghost" size="sm" onClick={() => onToggleActive(agent.id)} className="shrink-0">
              {agent.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">{agent.description}</CardDescription>

        <div className="flex flex-wrap gap-1">
          {agent.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {agent.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{agent.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>{agent.conversationCount} conversations</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(agent.createdAt)}</span>
          </div>
        </div>

        {agent.lastUsed && <div className="text-xs text-muted-foreground">Last used: {formatDate(agent.lastUsed)}</div>}

        <div className="flex gap-2 pt-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={`/agents/${agent.id}/chat`}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/agents/${agent.id}`}>
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
