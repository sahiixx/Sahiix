"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Clock,
  User,
  Workflow,
  Calendar,
  Zap,
  Webhook,
  Play,
  Eye,
  Database,
  LinkIcon,
  Bell,
  FileText,
  Activity,
} from "lucide-react"
import type { N8nWorkflow } from "@/lib/types"
import { useComparison } from "@/contexts/comparison-context"

interface WorkflowCardProps {
  workflow: N8nWorkflow
  showComparison?: boolean
}

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

export function WorkflowCard({ workflow, showComparison = true }: WorkflowCardProps) {
  const { selectedItems, addItem, removeItem, isSelected } = useComparison()
  const isWorkflowSelected = isSelected(workflow.id, "workflow")
  const CategoryIcon = categoryIcons[workflow.category] || Workflow
  const TriggerIcon = triggerIcons[workflow.triggerType] || Play

  const handleComparisonChange = (checked: boolean) => {
    if (checked) {
      addItem(workflow.id, "workflow", {
        id: workflow.id,
        name: workflow.name,
        type: "workflow",
        category: workflow.category,
        description: workflow.description,
      })
    } else {
      removeItem(workflow.id, "workflow")
    }
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
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <CategoryIcon className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {workflow.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {workflow.category}
                </Badge>
                <Badge className={`text-xs ${getComplexityColor(workflow.complexity)}`}>{workflow.complexity}</Badge>
              </div>
            </div>
          </div>
          {showComparison && (
            <Checkbox
              checked={isWorkflowSelected}
              onCheckedChange={handleComparisonChange}
              disabled={!isWorkflowSelected && selectedItems.length >= 3}
              className="ml-2 flex-shrink-0"
            />
          )}
        </div>
        <CardDescription className="text-sm leading-relaxed mt-2">{workflow.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-4">
          {workflow.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
              {tag}
            </Badge>
          ))}
          {workflow.tags.length > 4 && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              +{workflow.tags.length - 4} more
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <TriggerIcon className="h-4 w-4" />
            <span>{workflow.triggerType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            <span>{workflow.nodeCount} nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{workflow.estimatedRunTime || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{workflow.author || "Unknown"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Calendar className="h-3 w-3" />
          <span>Updated {new Date(workflow.lastUpdated).toLocaleDateString()}</span>
          <span>•</span>
          <span>v{workflow.version}</span>
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/workflows/${workflow.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
