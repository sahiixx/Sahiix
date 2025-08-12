import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"
import { getAgentById } from "@/lib/agent-database"

export async function POST(request: NextRequest) {
  try {
    const { agentId, message, conversationHistory = [] } = await request.json()

    if (!agentId || !message) {
      return new Response("Agent ID and message are required", { status: 400 })
    }

    // Get agent configuration
    const agent = getAgentById(agentId)
    if (!agent) {
      return new Response("Agent not found", { status: 404 })
    }

    if (!agent.isActive) {
      return new Response("Agent is not active", { status: 400 })
    }

    // Build conversation context
    const messages = [
      { role: "system" as const, content: agent.systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ]

    const result = streamText({
      model: xai("grok-beta", {
        apiKey: process.env.XAI_API_KEY,
      }),
      messages,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error in agent chat:", error)
    return new Response("Failed to generate response", { status: 500 })
  }
}
