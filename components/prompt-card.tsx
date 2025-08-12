import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, FileText, Tag, ExternalLink } from "lucide-react"
import { useComparison } from "@/contexts/comparison-context"
import type { SystemPrompt } from "@/lib/types"

interface PromptCardProps {
  prompt: SystemPrompt
}

export function PromptCard({ prompt }: PromptCardProps) {
  const { addPrompt, removePrompt, isSelected, canAddMore } = useComparison()

  const handleComparisonChange = (checked: boolean) => {
    if (checked) {
      addPrompt(prompt)
    } else {
      removePrompt(prompt.id)
    }
  }

  const selected = isSelected(prompt.id)

  return (
    <Card className={`h-full hover:shadow-lg transition-shadow ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {/* Added comparison checkbox */}
            <div className="flex items-start gap-3 mb-2">
              <Checkbox
                checked={selected}
                onCheckedChange={handleComparisonChange}
                disabled={!canAddMore && !selected}
                className="mt-1"
              />
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">{prompt.name}</CardTitle>
                <CardDescription className="mt-2 line-clamp-3">{prompt.description}</CardDescription>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">
            {prompt.tool}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{prompt.wordCount} words</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{new Date(prompt.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{prompt.category}</Badge>
          <Badge
            variant={
              prompt.complexity === "Advanced"
                ? "destructive"
                : prompt.complexity === "Intermediate"
                  ? "default"
                  : "outline"
            }
          >
            {prompt.complexity}
          </Badge>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{prompt.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Key Features:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {prompt.features.slice(0, 2).map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button asChild className="w-full">
          <Link href={`/prompts/${prompt.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
