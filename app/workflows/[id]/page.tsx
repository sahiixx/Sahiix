import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Workflow,
  Play,
  Webhook,
  Zap,
  Database,
  LinkIcon,
  Bell,
  FileText,
  Activity,
  GitCompare,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { getWorkflowById } from "@/lib/workflow-database"

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

interface WorkflowPageProps {
  params: {
    id: string
  }
}

export default function WorkflowPage({ params }: WorkflowPageProps) {
  const workflow = getWorkflowById(params.id)

  if (!workflow) {
    notFound()
  }

  const CategoryIcon = categoryIcons[workflow.category] || Workflow
  const TriggerIcon = triggerIcons[workflow.triggerType] || Play

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
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/workflows">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Workflows
              </Link>
            </Button>

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <CategoryIcon className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">{workflow.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{workflow.category}</Badge>
                    <Badge className={getComplexityColor(workflow.complexity)}>{workflow.complexity}</Badge>
                    <Badge variant="secondary">v{workflow.version}</Badge>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href={`/compare?workflows=${workflow.id}`}>
                  <GitCompare className="mr-2 h-4 w-4" />
                  Compare
                </Link>
              </Button>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{workflow.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Use Case */}
              <Card>
                <CardHeader>
                  <CardTitle>Use Case</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{workflow.useCase}</p>
                </CardContent>
              </Card>

              {/* Workflow Nodes */}
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Structure</CardTitle>
                  <CardDescription>
                    This workflow consists of {workflow.nodeCount} nodes working together
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workflow.nodes.map((node, index) => (
                      <div key={node.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{node.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Type: {node.type.replace("n8n-nodes-base.", "")}
                          </p>
                          {Object.keys(node.parameters).length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Key Parameters:</p>
                              <div className="flex flex-wrap gap-1">
                                {Object.keys(node.parameters)
                                  .slice(0, 3)
                                  .map((param) => (
                                    <Badge key={param} variant="outline" className="text-xs">
                                      {param}
                                    </Badge>
                                  ))}
                                {Object.keys(node.parameters).length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{Object.keys(node.parameters).length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {workflow.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Workflow Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TriggerIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Trigger Type</p>
                      <p className="text-sm text-muted-foreground">{workflow.triggerType}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Estimated Runtime</p>
                      <p className="text-sm text-muted-foreground">{workflow.estimatedRunTime || "Not specified"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Workflow className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Node Count</p>
                      <p className="text-sm text-muted-foreground">{workflow.nodeCount} nodes</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Author</p>
                      <p className="text-sm text-muted-foreground">{workflow.author || "Unknown"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workflow.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href={`/compare?workflows=${workflow.id}`}>
                      <GitCompare className="mr-2 h-4 w-4" />
                      Add to Comparison
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Workflow className="mr-2 h-4 w-4" />
                    Export Workflow
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
