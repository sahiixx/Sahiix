"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import {
  FlaskConical,
  Sparkles,
  Zap,
  Bot,
  Wand2,
  RefreshCw,
  Copy,
  Download,
  Target,
  BarChart3,
  Settings,
  Play,
  Plus,
  Eye,
  Timer,
  Hash,
  TrendingUp,
} from "lucide-react"
import { simulateModelResponse, modelProfiles, type ModelSimulation } from "@/lib/model-simulator"
import { optimizePrompt, analyzePrompt, type OptimizationResult, type PromptAnalysis } from "@/lib/prompt-optimizer"
import {
  generateWorkflow,
  workflowTemplates,
  type WorkflowGenerationRequest,
  type GeneratedWorkflow,
} from "@/lib/workflow-generator"
import {
  createNewExperiment,
  addVariationToExperiment,
  simulateExperimentResults,
  promptTemplates,
  variationPresets,
  type PlaygroundExperiment,
  type ExperimentResult,
} from "@/lib/playground-engine"

export default function LaboratoryPage() {
  const [userPrompt, setUserPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("v0")
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [promptAnalysis, setPromptAnalysis] = useState<PromptAnalysis | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [simulationResults, setSimulationResults] = useState<ModelSimulation[]>([])
  const [isSimulating, setIsSimulating] = useState(false)

  const [workflowDescription, setWorkflowDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("notifications")
  const [selectedTrigger, setSelectedTrigger] = useState("webhook")
  const [generatedWorkflow, setGeneratedWorkflow] = useState<GeneratedWorkflow | null>(null)
  const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false)

  // Added playground state management
  const [currentExperiment, setCurrentExperiment] = useState<PlaygroundExperiment | null>(null)
  const [experimentResults, setExperimentResults] = useState<ExperimentResult[]>([])
  const [isRunningExperiment, setIsRunningExperiment] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [experimentName, setExperimentName] = useState("")

  const handleOptimizePrompt = async () => {
    if (!userPrompt.trim()) return

    setIsOptimizing(true)

    setTimeout(() => {
      const analysis = analyzePrompt(userPrompt)
      const optimization = optimizePrompt(userPrompt, selectedModel)

      setPromptAnalysis(analysis)
      setOptimizationResult(optimization)
      setIsOptimizing(false)
    }, 2000)
  }

  const handleSimulateModels = async () => {
    if (!userPrompt.trim()) return

    setIsSimulating(true)
    setSimulationResults([])

    const results: ModelSimulation[] = []

    for (const model of modelProfiles) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const simulation = simulateModelResponse(userPrompt, model.id)
      results.push(simulation)
      setSimulationResults([...results])
    }

    setIsSimulating(false)
  }

  // Added workflow generation handler
  const handleGenerateWorkflow = async () => {
    if (!workflowDescription.trim()) return

    setIsGeneratingWorkflow(true)

    setTimeout(() => {
      const request: WorkflowGenerationRequest = {
        description: workflowDescription,
        category: selectedCategory || undefined,
        triggerType: (selectedTrigger as any) || undefined,
        complexity: "Intermediate",
      }

      const result = generateWorkflow(request)
      setGeneratedWorkflow(result)
      setIsGeneratingWorkflow(false)
    }, 3000)
  }

  // Added playground handlers
  const handleCreateExperiment = () => {
    if (!userPrompt.trim() || !experimentName.trim()) return

    const experiment = createNewExperiment(experimentName, userPrompt)
    setCurrentExperiment(experiment)
    setExperimentResults([])
  }

  const handleRunExperiment = async () => {
    if (!currentExperiment) return

    setIsRunningExperiment(true)
    setExperimentResults([])

    // Simulate running each variation
    for (let i = 0; i < currentExperiment.variations.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const partialResults = simulateExperimentResults(currentExperiment.variations.slice(0, i + 1))
      setExperimentResults(partialResults)
    }

    setIsRunningExperiment(false)
  }

  const handleAddVariation = () => {
    if (!currentExperiment || !userPrompt.trim()) return

    const newExperiment = addVariationToExperiment(
      currentExperiment,
      `Custom ${currentExperiment.variations.length + 1}`,
      userPrompt,
      { style: "detailed", complexity: "intermediate", tone: "technical" },
    )
    setCurrentExperiment(newExperiment)
  }

  const handleLoadTemplate = (templateId: string) => {
    const template = promptTemplates.find((t) => t.id === templateId)
    if (template) {
      setUserPrompt(template.basePrompt)
      setExperimentName(template.name + " Experiment")
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FlaskConical className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">AI Prompt Laboratory</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experiment with prompts, optimize them using expert knowledge, and see how different AI models would
              interpret them.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Prompt Input & Configuration
                </CardTitle>
                <CardDescription>Enter your prompt and select the target AI model for optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Target AI Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modelProfiles.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            <span className="text-xs text-muted-foreground">{model.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Prompt</label>
                  <Textarea
                    placeholder="Enter your prompt here... e.g., 'Create a login form with validation'"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                {userPrompt.trim() && promptAnalysis && (
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Analysis:</span>
                      <Badge variant="outline">{promptAnalysis.complexity}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Clarity: {promptAnalysis.clarity}%
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Specificity: {promptAnalysis.specificity}%
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        Structure: {promptAnalysis.structure}%
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleOptimizePrompt}
                    disabled={!userPrompt.trim() || isOptimizing}
                    className="flex-1"
                  >
                    {isOptimizing ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Optimize Prompt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSimulateModels}
                    disabled={!userPrompt.trim() || isSimulating}
                  >
                    {isSimulating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Bot className="mr-2 h-4 w-4" />
                    )}
                    Simulate Models
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() =>
                    optimizationResult && navigator.clipboard.writeText(optimizationResult.optimizedPrompt)
                  }
                  disabled={!optimizationResult}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Optimized Prompt
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Variations
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="mt-8">
            <Tabs defaultValue="optimization" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="optimization">Optimization</TabsTrigger>
                <TabsTrigger value="simulation">Model Simulation</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="workflow">Workflow Generator</TabsTrigger>
                <TabsTrigger value="playground">Interactive Playground</TabsTrigger>
              </TabsList>

              {/* Added workflow generator tab */}
              <TabsContent value="workflow" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Workflow Configuration
                      </CardTitle>
                      <CardDescription>Describe your automation needs and generate an n8n workflow</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Workflow Description</label>
                        <Textarea
                          placeholder="Describe what you want to automate... e.g., 'Send Slack notification when new GitHub issue is created'"
                          value={workflowDescription}
                          onChange={(e) => setWorkflowDescription(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Category (Optional)</label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Auto-detect" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="notifications">Notifications</SelectItem>
                              <SelectItem value="data-processing">Data Processing</SelectItem>
                              <SelectItem value="api-integration">API Integration</SelectItem>
                              <SelectItem value="automation">Automation</SelectItem>
                              <SelectItem value="monitoring">Monitoring</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Trigger Type (Optional)</label>
                          <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                            <SelectTrigger>
                              <SelectValue placeholder="Auto-detect" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="webhook">Webhook</SelectItem>
                              <SelectItem value="schedule">Schedule</SelectItem>
                              <SelectItem value="manual">Manual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        onClick={handleGenerateWorkflow}
                        disabled={!workflowDescription.trim() || isGeneratingWorkflow}
                        className="w-full"
                      >
                        {isGeneratingWorkflow ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="mr-2 h-4 w-4" />
                        )}
                        Generate Workflow
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Templates Available
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {workflowTemplates.map((template) => (
                          <div key={template.id} className="p-2 border rounded-lg">
                            <h4 className="text-sm font-medium">{template.name}</h4>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {template.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {generatedWorkflow && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Generated Workflow
                          <Badge variant="outline">{generatedWorkflow.confidence}% confidence</Badge>
                        </CardTitle>
                        <CardDescription>{generatedWorkflow.explanation}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Workflow Details:</h4>
                          <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Name:</span>
                              <span className="font-medium">{generatedWorkflow.workflow.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Category:</span>
                              <Badge variant="secondary">{generatedWorkflow.workflow.category}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Trigger:</span>
                              <Badge variant="outline">{generatedWorkflow.workflow.triggerType}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Nodes:</span>
                              <span>{generatedWorkflow.workflow.nodeCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Complexity:</span>
                              <Badge variant="outline">{generatedWorkflow.workflow.complexity}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Est. Runtime:</span>
                              <span>{generatedWorkflow.workflow.estimatedRunTime}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Workflow Nodes:</h4>
                          <div className="space-y-2">
                            {generatedWorkflow.workflow.nodes.map((node, idx) => (
                              <div key={node.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{node.name}</p>
                                  <p className="text-xs text-muted-foreground">{node.type}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Suggestions & Next Steps</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Target className="h-4 w-4 text-blue-500" />
                            Recommendations:
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {generatedWorkflow.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Template Used:</h4>
                          <div className="space-y-1">
                            {generatedWorkflow.templateUsed.map((template) => (
                              <Badge key={template} variant="secondary" className="text-xs">
                                {template}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Download className="mr-2 h-4 w-4" />
                            Export n8n JSON
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {!generatedWorkflow && !isGeneratingWorkflow && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">
                        Describe your automation needs above and click "Generate Workflow" to create an n8n workflow
                      </p>
                    </CardContent>
                  </Card>
                )}

                {isGeneratingWorkflow && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <div className="space-y-4">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground">Generating your workflow...</p>
                        <Progress value={66} className="w-full max-w-md mx-auto" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Added interactive playground tab */}
              <TabsContent value="playground" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Play className="h-5 w-5" />
                        Experiment Setup
                      </CardTitle>
                      <CardDescription>Create and run prompt experiments with multiple variations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Experiment Name</label>
                          <Input
                            placeholder="My Prompt Experiment"
                            value={experimentName}
                            onChange={(e) => setExperimentName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Load Template</label>
                          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose template..." />
                            </SelectTrigger>
                            <SelectContent>
                              {promptTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleCreateExperiment}
                          disabled={!userPrompt.trim() || !experimentName.trim()}
                          className="flex-1"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Experiment
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => selectedTemplate && handleLoadTemplate(selectedTemplate)}
                          disabled={!selectedTemplate}
                        >
                          Load Template
                        </Button>
                      </div>

                      {currentExperiment && (
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Current Experiment: {currentExperiment.name}</h4>
                            <div className="flex gap-2">
                              <Button onClick={handleRunExperiment} disabled={isRunningExperiment} size="sm">
                                {isRunningExperiment ? (
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Play className="mr-2 h-4 w-4" />
                                )}
                                Run Experiment
                              </Button>
                              <Button onClick={handleAddVariation} variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Variation
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {currentExperiment.variations.map((variation, index) => (
                              <div key={variation.id} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full bg-${variation.color}-500`}></div>
                                    <span className="font-medium text-sm">{variation.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {variation.parameters.style}
                                    </Badge>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{variation.prompt}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Variation Presets
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {variationPresets.map((preset) => (
                          <div key={preset.name} className="p-2 border rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-2 h-2 rounded-full bg-${preset.color}-500`}></div>
                              <span className="text-sm font-medium">{preset.name}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {preset.parameters.style} • {preset.parameters.complexity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Experiment Results */}
                {experimentResults.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experimentResults.map((result) => {
                      const variation = currentExperiment?.variations.find((v) => v.id === result.variationId)
                      return (
                        <Card key={result.variationId}>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between text-base">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full bg-${variation?.color}-500`}></div>
                                {variation?.name}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {result.metrics.quality}% quality
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Timer className="h-3 w-3" />
                                </div>
                                <div className="font-medium">{result.metrics.responseTime}ms</div>
                                <div className="text-muted-foreground">Response</div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Hash className="h-3 w-3" />
                                </div>
                                <div className="font-medium">{result.metrics.tokenCount}</div>
                                <div className="text-muted-foreground">Tokens</div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <TrendingUp className="h-3 w-3" />
                                </div>
                                <div className="font-medium">{result.metrics.creativity}%</div>
                                <div className="text-muted-foreground">Creative</div>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium mb-2">Output Preview:</h5>
                              <div className="bg-muted p-3 rounded text-xs max-h-32 overflow-y-auto">
                                <pre className="whitespace-pre-wrap">{result.output.slice(0, 200)}...</pre>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Relevance</span>
                                <span>{result.metrics.relevance}%</span>
                              </div>
                              <Progress value={result.metrics.relevance} className="h-1" />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}

                {!currentExperiment && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Interactive Playground</h3>
                      <p className="text-muted-foreground mb-6">
                        Create experiments to test multiple prompt variations side-by-side and compare their
                        performance.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {promptTemplates.slice(0, 4).map((template) => (
                          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              <CardDescription className="text-xs">{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                                onClick={() => handleLoadTemplate(template.id)}
                              >
                                Use Template
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isRunningExperiment && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <div className="space-y-4">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground">Running experiment variations...</p>
                        <Progress
                          value={(experimentResults.length / (currentExperiment?.variations.length || 1)) * 100}
                          className="w-full max-w-md mx-auto"
                        />
                        <p className="text-sm text-muted-foreground">
                          {experimentResults.length} of {currentExperiment?.variations.length} variations complete
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  )
}
