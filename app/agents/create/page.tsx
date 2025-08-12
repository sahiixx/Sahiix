"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Bot, Save, ArrowLeft, AlertCircle } from "lucide-react"
import { getAgentTemplates } from "@/lib/agent-database"
import { AgentService } from "@/lib/agent-service"
import type { AIAgent } from "@/lib/types"

export default function CreateAgentPage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")

  const [formData, setFormData] = useState<Partial<AIAgent>>({
    name: "",
    description: "",
    systemPrompt: "",
    model: "grok-beta",
    temperature: 0.7,
    maxTokens: 2000,
    category: "Assistant",
    tags: [],
    isActive: true,
    capabilities: [],
  })

  const [tagInput, setTagInput] = useState("")
  const [capabilityInput, setCapabilityInput] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load template if specified
  useEffect(() => {
    if (templateId) {
      const templates = getAgentTemplates()
      const template = templates.find((t) => t.id === templateId)
      if (template) {
        setFormData({
          name: template.name,
          description: template.description,
          systemPrompt: template.systemPrompt,
          model: template.model,
          temperature: template.temperature,
          maxTokens: template.maxTokens,
          category: template.category,
          tags: [...template.tags],
          capabilities: [...template.capabilities],
          isActive: true,
        })
      }
    }
  }, [templateId])

  const categories: AIAgent["category"][] = [
    "Assistant",
    "Code Helper",
    "Data Analyst",
    "Creative",
    "Research",
    "Custom",
  ]
  const models: AIAgent["model"][] = ["grok-beta", "grok-vision-beta"]

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    })
  }

  const handleAddCapability = () => {
    if (capabilityInput.trim() && !formData.capabilities?.includes(capabilityInput.trim())) {
      setFormData({
        ...formData,
        capabilities: [...(formData.capabilities || []), capabilityInput.trim()],
      })
      setCapabilityInput("")
    }
  }

  const handleRemoveCapability = (capabilityToRemove: string) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities?.filter((cap) => cap !== capabilityToRemove) || [],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors([])

    // Validate form
    const validationErrors = AgentService.validateAgentConfig(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsLoading(false)
      return
    }

    try {
      // In a real app, this would save to a database
      const newAgent: AIAgent = {
        id: `agent-${Date.now()}`,
        name: formData.name!,
        description: formData.description!,
        systemPrompt: formData.systemPrompt!,
        model: formData.model!,
        temperature: formData.temperature!,
        maxTokens: formData.maxTokens!,
        category: formData.category!,
        tags: formData.tags || [],
        isActive: formData.isActive!,
        createdAt: new Date().toISOString(),
        conversationCount: 0,
        capabilities: formData.capabilities || [],
        examples: [],
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to agent page
      window.location.href = `/agents/${newAgent.id}`
    } catch (error) {
      setErrors(["Failed to create agent. Please try again."])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <a href="/agents">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Agents
              </a>
            </Button>
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Bot className="h-10 w-10 text-primary" />
                Create AI Agent
              </h1>
              <p className="text-lg text-muted-foreground">
                {templateId
                  ? "Customize your agent based on the selected template"
                  : "Build a custom AI agent from scratch"}
              </p>
            </div>
          </div>

          {errors.length > 0 && (
            <Card className="mb-6 border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Validation Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm text-destructive">
                      {error}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Define the core properties of your AI agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Agent Name *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Code Assistant Pro"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: AIAgent["category"]) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what your agent does and how it helps users..."
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Prompt */}
            <Card>
              <CardHeader>
                <CardTitle>System Prompt *</CardTitle>
                <CardDescription>Define how your agent behaves and responds to users</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.systemPrompt || ""}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  placeholder="You are a helpful AI assistant that..."
                  rows={8}
                  className="font-mono text-sm"
                  required
                />
              </CardContent>
            </Card>

            {/* Model Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Model Configuration</CardTitle>
                <CardDescription>Configure the AI model settings for your agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Select
                      value={formData.model}
                      onValueChange={(value: AIAgent["model"]) => setFormData({ ...formData, model: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {AgentService.formatModelName(model)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      min="1"
                      max="4000"
                      value={formData.maxTokens || 2000}
                      onChange={(e) => setFormData({ ...formData, maxTokens: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Temperature: {formData.temperature}</Label>
                  <div className="mt-2">
                    <Slider
                      value={[formData.temperature || 0.7]}
                      onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>More Focused</span>
                    <span>More Creative</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags and Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle>Tags & Capabilities</CardTitle>
                <CardDescription>
                  Add tags and capabilities to help users discover and understand your agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Capabilities</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={capabilityInput}
                      onChange={(e) => setCapabilityInput(e.target.value)}
                      placeholder="Add a capability..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCapability())}
                    />
                    <Button type="button" onClick={handleAddCapability}>
                      Add
                    </Button>
                  </div>
                  {formData.capabilities && formData.capabilities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.capabilities.map((capability) => (
                        <Badge
                          key={capability}
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => handleRemoveCapability(capability)}
                        >
                          {capability} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" size="lg" disabled={isLoading} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Creating Agent..." : "Create Agent"}
              </Button>
              <Button type="button" variant="outline" size="lg" asChild>
                <a href="/agents">Cancel</a>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
