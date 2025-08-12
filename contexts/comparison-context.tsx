"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { SystemPrompt, N8nWorkflow } from "@/lib/types"

interface ComparisonItem {
  id: string
  name: string
  type: "prompt" | "workflow"
  category: string
  description: string
}

interface ComparisonContextType {
  selectedItems: ComparisonItem[]
  selectedPrompts: SystemPrompt[]
  selectedWorkflows: N8nWorkflow[]
  addItem: (id: string, type: "prompt" | "workflow", item: ComparisonItem) => void
  removeItem: (id: string, type: "prompt" | "workflow") => void
  clearAll: () => void
  isSelected: (id: string, type: "prompt" | "workflow") => boolean
  canAddMore: boolean
  addPrompt: (prompt: SystemPrompt) => void
  removePrompt: (promptId: string) => void
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<ComparisonItem[]>([])
  const [selectedPrompts, setSelectedPrompts] = useState<SystemPrompt[]>([])
  const [selectedWorkflows, setSelectedWorkflows] = useState<N8nWorkflow[]>([])

  const addItem = (id: string, type: "prompt" | "workflow", item: ComparisonItem) => {
    if (selectedItems.length < 3 && !selectedItems.find((i) => i.id === id && i.type === type)) {
      setSelectedItems((prev) => [...prev, item])
    }
  }

  const removeItem = (id: string, type: "prompt" | "workflow") => {
    setSelectedItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)))
  }

  const clearAll = () => {
    setSelectedItems([])
    setSelectedPrompts([])
    setSelectedWorkflows([])
  }

  const isSelected = (id: string, type: "prompt" | "workflow") => {
    return selectedItems.some((i) => i.id === id && i.type === type)
  }

  const canAddMore = selectedItems.length < 3

  const addPrompt = (prompt: SystemPrompt) => {
    if (selectedPrompts.length < 3 && !selectedPrompts.find((p) => p.id === prompt.id)) {
      setSelectedPrompts((prev) => [...prev, prompt])
      addItem(prompt.id, "prompt", {
        id: prompt.id,
        name: prompt.name,
        type: "prompt",
        category: prompt.category,
        description: prompt.description,
      })
    }
  }

  const removePrompt = (promptId: string) => {
    setSelectedPrompts((prev) => prev.filter((p) => p.id !== promptId))
    removeItem(promptId, "prompt")
  }

  return (
    <ComparisonContext.Provider
      value={{
        selectedItems,
        selectedPrompts,
        selectedWorkflows,
        addItem,
        removeItem,
        clearAll,
        isSelected,
        canAddMore,
        addPrompt,
        removePrompt,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider")
  }
  return context
}
