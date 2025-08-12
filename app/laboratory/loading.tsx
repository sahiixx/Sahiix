import { Skeleton } from "@/components/ui/skeleton"
import { Navigation } from "@/components/navigation"

export default function LaboratoryLoading() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>

          <div className="mt-8">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </main>
    </>
  )
}
