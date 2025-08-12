"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, FileText, Tag, ExternalLink, Copy } from "lucide-react"
import { getPromptById } from "@/lib/prompt-database"

interface PromptDetailPageProps {
  params: {
    id: string
  }
}

export default function PromptDetailPage({ params }: PromptDetailPageProps) {
  const prompt = getPromptById(params.id)

  if (!prompt) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/prompts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Prompts
          </Link>
        </Button>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{prompt.name}</h1>
            <p className="text-lg text-muted-foreground">{prompt.description}</p>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {prompt.tool}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Prompt Content
              </CardTitle>
              <CardDescription>The complete system prompt used by {prompt.tool}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-x-auto font-mono">
                  {prompt.content}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => navigator.clipboard.writeText(prompt.content)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>Main capabilities and focus areas of this system prompt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prompt.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <Badge variant="secondary">{prompt.category}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Complexity</span>
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

              <Separator />

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(prompt.lastUpdated).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Word Count:</span>
                <span>{prompt.wordCount}</span>
              </div>

              {prompt.version && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Version:</span>
                  <Badge variant="outline">{prompt.version}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => navigator.clipboard.writeText(prompt.content)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Prompt
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/compare">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Compare with Others
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
