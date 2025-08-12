import type { AIAgent, Message, Conversation } from "./types"

export class AgentService {
  static async sendMessage(
    agentId: string,
    message: string,
    conversationHistory: Message[] = [],
  ): Promise<ReadableStream<Uint8Array> | null> {
    try {
      const response = await fetch("/api/agents/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId,
          message,
          conversationHistory: conversationHistory.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.body
    } catch (error) {
      console.error("Error sending message to agent:", error)
      throw error
    }
  }

  static async processStreamingResponse(
    stream: ReadableStream<Uint8Array>,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: Error) => void,
  ): Promise<void> {
    try {
      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullResponse += chunk
        onChunk(chunk)
      }

      onComplete(fullResponse)
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Unknown streaming error"))
    }
  }

  static generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  static generateConversationId(): string {
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  static createMessage(role: "user" | "assistant" | "system", content: string, model?: string): Message {
    return {
      id: this.generateMessageId(),
      role,
      content,
      timestamp: new Date().toISOString(),
      tokens: this.estimateTokens(content),
      model,
    }
  }

  static createConversation(agentId: string, title: string, initialMessage?: Message): Conversation {
    return {
      id: this.generateConversationId(),
      agentId,
      title,
      messages: initialMessage ? [initialMessage] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
    }
  }

  static estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4)
  }

  static generateConversationTitle(firstMessage: string): string {
    // Generate a title from the first message (first 50 characters)
    const title = firstMessage.trim().slice(0, 50)
    return title.length < firstMessage.trim().length ? `${title}...` : title
  }

  static formatModelName(model: string): string {
    switch (model) {
      case "grok-beta":
        return "Grok Beta"
      case "grok-vision-beta":
        return "Grok Vision Beta"
      default:
        return model
    }
  }

  static validateAgentConfig(agent: Partial<AIAgent>): string[] {
    const errors: string[] = []

    if (!agent.name?.trim()) {
      errors.push("Agent name is required")
    }

    if (!agent.description?.trim()) {
      errors.push("Agent description is required")
    }

    if (!agent.systemPrompt?.trim()) {
      errors.push("System prompt is required")
    }

    if (!agent.model) {
      errors.push("Model selection is required")
    }

    if (agent.temperature !== undefined && (agent.temperature < 0 || agent.temperature > 2)) {
      errors.push("Temperature must be between 0 and 2")
    }

    if (agent.maxTokens !== undefined && (agent.maxTokens < 1 || agent.maxTokens > 4000)) {
      errors.push("Max tokens must be between 1 and 4000")
    }

    return errors
  }
}
