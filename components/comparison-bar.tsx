"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { X, GitCompare, Code2, Workflow } from "lucide-react"
import { useComparison } from "@/contexts/comparison-context"

export function ComparisonBar() {
  const { selectedItems, removeItem, clearAll } = useComparison()

  if (selectedItems.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card className="p-4 shadow-lg border-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <GitCompare className="h-5 w-5 text-primary shrink-0" />
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-sm font-medium shrink-0">Compare:</span>
              {selectedItems.map((item) => (
                <Badge key={`${item.type}-${item.id}`} variant="secondary" className="gap-1 max-w-32">
                  {item.type === "prompt" ? <Code2 className="h-3 w-3" /> : <Workflow className="h-3 w-3" />}
                  <span className="truncate">{item.name}</span>
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeItem(item.id, item.type)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
            <Button asChild size="sm">
              <Link href="/compare">Compare ({selectedItems.length})</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
