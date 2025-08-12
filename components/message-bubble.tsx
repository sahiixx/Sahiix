"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, User, Copy, Check } from "lucide-react"
import { useState } from "react"
import type { Message } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <Badge variant="outline" className="text-xs">
          System: {message.content}
        </Badge>
      </div>
    )
  }

  return (
    <div className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary" : "bg-muted",
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <div className={cn("flex-1 max-w-[80%]", isUser && "flex flex-col items-end")}>
        <Card className={cn("p-3", isUser ? "bg-primary text-primary-foreground" : "bg-muted/50")}>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap break-words">
              {message.content}
              {isStreaming && <span className="animate-pulse">▋</span>}
            </div>
          </div>
        </Card>

        <div className={cn("flex items-center gap-2 mt-1 text-xs text-muted-foreground", isUser && "flex-row-reverse")}>
          <span>{formatTimestamp(message.timestamp)}</span>
          {message.tokens && <span>• {message.tokens} tokens</span>}
          {message.model && <span>• {message.model}</span>}
          {!isUser && message.content && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
