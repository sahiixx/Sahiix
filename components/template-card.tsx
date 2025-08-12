"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Star, Zap, Users } from "lucide-react"
import type { AgentTemplate } from "@/lib/types"

interface TemplateCardProps {
  template: AgentTemplate
  onUseTemplate: (template: AgentTemplate) => void
  onPreview?: (template: AgentTemplate) => void
}

export function TemplateCard({ template, onUseTemplate, onPreview }: TemplateCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 relative">
      {template.isPopular && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="default" className="gap-1 text-xs">
            <Star className="h-3 w-3" />
            Popular
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {template.model}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">{template.description}</CardDescription>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Capabilities</h4>
            <div className="flex flex-wrap gap-1">
              {template.capabilities.slice(0, 3).map((capability) => (
                <Badge key={capability} variant="secondary" className="text-xs">
                  {capability}
                </Badge>
              ))}
              {template.capabilities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.capabilities.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Temp: {template.temperature}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{template.maxTokens} tokens</span>
            </div>
          </div>

          {template.examples.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Example Use Cases</h4>
              <div className="space-y-1">
                {template.examples.slice(0, 2).map((example) => (
                  <div key={example.id} className="text-xs text-muted-foreground">
                    • {example.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={() => onUseTemplate(template)} className="flex-1">
            Use Template
          </Button>
          {onPreview && (
            <Button variant="outline" onClick={() => onPreview(template)}>
              Preview
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
