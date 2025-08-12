"use client"

import { useState, useCallback } from "react"
import { AgentService } from "@/lib/agent-service"
import type { Message, AIAgent } from "@/lib/types"

interface UseAgentChatProps {
  agent: AIAgent
  initialMessages?: Message[]
}

interface UseAgentChatReturn {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  clearError: () => void
}

export function useAgentChat({ agent, initialMessages = [] }: UseAgentChatProps): UseAgentChatReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setIsLoading(true)
      setError(null)

      // Add user message
      const userMessage = AgentService.createMessage("user", content)
      setMessages((prev) => [...prev, userMessage])

      // Create placeholder assistant message
      const assistantMessage = AgentService.createMessage("assistant", "", agent.model)
      setMessages((prev) => [...prev, assistantMessage])

      try {
        const stream = await AgentService.sendMessage(agent.id, content, messages)

        if (!stream) {
          throw new Error("No response stream received")
        }

        await AgentService.processStreamingResponse(
          stream,
          (chunk: string) => {
            // Update the assistant message with streaming content
            setMessages((prev) => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage && lastMessage.role === "assistant") {
                lastMessage.content += chunk
                lastMessage.timestamp = new Date().toISOString()
              }
              return newMessages
            })
          },
          (fullResponse: string) => {
            // Final update with complete response
            setMessages((prev) => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage && lastMessage.role === "assistant") {
                lastMessage.content = fullResponse
                lastMessage.tokens = AgentService.estimateTokens(fullResponse)
                lastMessage.timestamp = new Date().toISOString()
              }
              return newMessages
            })
          },
          (streamError: Error) => {
            console.error("Streaming error:", streamError)
            setError("Failed to receive complete response")
            // Remove the incomplete assistant message
            setMessages((prev) => prev.slice(0, -1))
          },
        )
      } catch (err) {
        console.error("Error sending message:", err)
        setError(err instanceof Error ? err.message : "Failed to send message")
        // Remove both user and assistant messages on error
        setMessages((prev) => prev.slice(0, -2))
      } finally {
        setIsLoading(false)
      }
    },
    [agent.id, agent.model, messages, isLoading],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError,
  }
}
