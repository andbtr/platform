import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
      </div>

      {/* Content Areas Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment Info/History Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
        
        {/* QR / Next steps Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
