"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  GitCompare,
  Copy,
  FileText,
  Calendar,
  Code2,
  Workflow,
  Clock,
  User,
  Play,
  Webhook,
  Zap,
  Database,
  LinkIcon,
  Bell,
  Activity,
} from "lucide-react"
import { useComparison } from "@/contexts/comparison-context"
import { getWorkflowById } from "@/lib/workflow-database"
import { getPromptById } from "@/lib/prompt-database"

const categoryIcons = {
  "Data Processing": Database,
  "API Integration": LinkIcon,
  Notifications: Bell,
  "Content Management": FileText,
  Automation: Zap,
  Monitoring: Activity,
}

const triggerIcons = {
  Manual: Play,
  Webhook: Webhook,
  Schedule: Clock,
  Event: Zap,
}

export default function ComparePage() {
  const { selectedItems, clearAll } = useComparison()

  const selectedPrompts = selectedItems
    .filter((item) => item.type === "prompt")
    .map((item) => getPromptById(item.id))
    .filter(Boolean)

  const selectedWorkflows = selectedItems
    .filter((item) => item.type === "workflow")
    .map((item) => getWorkflowById(item.id))
    .filter(Boolean)

  const allSelectedItems = [...selectedPrompts, ...selectedWorkflows]

  if (selectedItems.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <h1 className="text-4xl font-bold mb-4">Compare AI Tools & Workflows</h1>
            <p className="text-lg text-muted-foreground">
              Compare AI system prompts and automation workflows side by side to understand different approaches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="text-center py-8">
              <CardHeader>
                <Code2 className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>AI System Prompts</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                  Compare system prompts from different AI development tools to understand their configurations and
                  approaches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/prompts">Browse AI Prompts</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center py-8">
              <CardHeader>
                <Workflow className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Automation Workflows</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                  Compare n8n automation workflows to learn different patterns and implementation strategies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/workflows">Browse Workflows</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                AI + Automation Integration Ideas
              </CardTitle>
              <CardDescription>Discover how AI tools and automation workflows can work together</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">AI-Powered Content Workflows</h4>
                  <p className="text-sm text-muted-foreground">
                    Use AI prompts to generate content, then automate publishing and distribution with n8n workflows.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Code Review Automation</h4>
                  <p className="text-sm text-muted-foreground">
                    Combine AI code analysis prompts with GitHub webhook workflows for automated code review processes.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Smart Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Use AI to analyze data patterns, then trigger intelligent notifications through automated workflows.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Basic":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Compare AI Tools & Workflows</h1>
            <p className="text-lg text-muted-foreground">
              Comparing {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} side by side
              {selectedPrompts.length > 0 && selectedWorkflows.length > 0 && (
                <span className="ml-2">
                  ({selectedPrompts.length} prompt{selectedPrompts.length !== 1 ? "s" : ""}, {selectedWorkflows.length}{" "}
                  workflow{selectedWorkflows.length !== 1 ? "s" : ""})
                </span>
              )}
            </p>
          </div>
          <Button variant="outline" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-6 ${selectedItems.length === 1 ? "grid-cols-1" : selectedItems.length === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-3"}`}
      >
        {selectedPrompts.map((prompt) => (
          <Card key={`prompt-${prompt.id}`} className="h-fit border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-blue-500" />
                  <div>
                    <CardTitle className="text-xl">{prompt.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      AI Prompt
                    </Badge>
                  </div>
                </div>
                <Badge variant="outline">{prompt.tool}</Badge>
              </div>
              <CardDescription className="mt-2">{prompt.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(prompt.lastUpdated).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{prompt.wordCount} words</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">{prompt.category}</Badge>
                <Badge className={getComplexityColor(prompt.complexity)}>{prompt.complexity}</Badge>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Key Features</h4>
                <div className="space-y-1">
                  {prompt.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">System Prompt</h4>
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(prompt.content)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs bg-muted p-3 rounded font-mono">{prompt.content}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {selectedWorkflows.map((workflow) => {
          const CategoryIcon = categoryIcons[workflow.category] || Workflow
          const TriggerIcon = triggerIcons[workflow.triggerType] || Play

          return (
            <Card key={`workflow-${workflow.id}`} className="h-fit border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-5 w-5 text-green-500" />
                    <div>
                      <CardTitle className="text-xl">{workflow.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        n8n Workflow
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline">{workflow.category}</Badge>
                </div>
                <CardDescription className="mt-2">{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(workflow.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-muted-foreground" />
                    <span>{workflow.nodeCount} nodes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{workflow.category}</Badge>
                  <Badge className={getComplexityColor(workflow.complexity)}>{workflow.complexity}</Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <TriggerIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{workflow.triggerType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{workflow.estimatedRunTime || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{workflow.author || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">v{workflow.version}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Use Case</h4>
                  <p className="text-sm text-muted-foreground">{workflow.useCase}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Workflow Nodes ({workflow.nodeCount})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {workflow.nodes.slice(0, 3).map((node, index) => (
                      <div key={node.id} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                        <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                        <span className="font-medium">{node.name}</span>
                      </div>
                    ))}
                    {workflow.nodes.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{workflow.nodes.length - 3} more nodes
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {workflow.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedPrompts.length > 0 && selectedWorkflows.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Integration Opportunities
            </CardTitle>
            <CardDescription>Potential ways these AI prompts and workflows could work together</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">🤖 AI-Enhanced Automation</h4>
                <p className="text-sm text-muted-foreground">
                  The selected AI prompts could be integrated into the workflow nodes to add intelligent
                  decision-making, content generation, or data analysis capabilities to your automation processes.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">🔄 Workflow-Triggered AI</h4>
                <p className="text-sm text-muted-foreground">
                  Use the automation workflows to trigger AI processing at specific events, creating dynamic systems
                  that respond intelligently to data changes or user actions.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">📊 Intelligent Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  Combine AI analysis capabilities with workflow automation to create smart monitoring systems that can
                  understand context and make informed decisions about alerts and responses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
