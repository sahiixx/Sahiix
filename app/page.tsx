import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code2, Search, GitCompare, Sparkles, Workflow, Zap, Bot, FlaskConical } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const aiTools = [
    { name: "v0", description: "AI-powered React component generator", category: "Code Generation" },
    { name: "Cursor", description: "AI-first code editor", category: "IDE" },
    { name: "Devin", description: "AI software engineer", category: "Agent" },
    { name: "Replit", description: "Collaborative coding platform", category: "Platform" },
    { name: "Windsurf", description: "AI coding assistant", category: "Assistant" },
    { name: "Claude", description: "AI assistant by Anthropic", category: "LLM" },
  ]

  const workflowCategories = [
    { name: "Data Processing", description: "ETL, data transformation, and analysis workflows", count: 12 },
    { name: "API Integration", description: "Connect and sync data between different services", count: 8 },
    { name: "Notifications", description: "Automated alerts, emails, and messaging workflows", count: 15 },
    { name: "Content Management", description: "Automated content creation and publishing", count: 6 },
  ]

  const agentCategories = [
    { name: "Code Helper", description: "Programming assistants for debugging and optimization", count: 5 },
    { name: "Data Analyst", description: "Statistical analysis and data visualization experts", count: 3 },
    { name: "Creative", description: "Writing and content creation specialists", count: 4 },
    { name: "Research", description: "Information gathering and analysis assistants", count: 2 },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI Tools & Automation Hub
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover AI system prompts from leading development tools, explore powerful n8n automation workflows, and
              create custom AI agents for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/prompts">
                  <Code2 className="mr-2 h-5 w-5" />
                  Explore AI Prompts
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/workflows">
                  <Workflow className="mr-2 h-5 w-5" />
                  Browse Workflows
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/agents">
                  <Bot className="mr-2 h-5 w-5" />
                  AI Agents
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/compare">
                  <GitCompare className="mr-2 h-5 w-5" />
                  Compare Tools
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/laboratory">
                  <FlaskConical className="mr-2 h-5 w-5" />
                  AI Laboratory
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div>
              <h2 className="text-3xl font-semibold text-center mb-8 flex items-center justify-center gap-2">
                <Code2 className="h-8 w-8 text-primary" />
                AI Development Tools
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {aiTools.map((tool) => (
                  <Card key={tool.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Code2 className="h-4 w-4" />
                          {tool.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">{tool.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-center mb-8 flex items-center justify-center gap-2">
                <Zap className="h-8 w-8 text-primary" />
                Automation Workflows
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {workflowCategories.map((category) => (
                  <Card key={category.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Workflow className="h-4 w-4" />
                          {category.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {category.count} workflows
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">{category.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-center mb-8 flex items-center justify-center gap-2">
                <Bot className="h-8 w-8 text-primary" />
                AI Agents
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {agentCategories.map((category) => (
                  <Card key={category.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Bot className="h-4 w-4" />
                          {category.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {category.count} agents
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">{category.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Search className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Search & Filter</CardTitle>
                <CardDescription>
                  Find specific prompts, workflows, and agents by tool, category, or content with powerful search
                  capabilities
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <GitCompare className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Compare & Analyze</CardTitle>
                <CardDescription>
                  Side-by-side comparison of system prompts, workflows, and AI agents to understand different approaches
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Bot className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Create & Automate</CardTitle>
                <CardDescription>
                  Build custom AI agents, discover automation patterns, and learn prompt engineering techniques
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
