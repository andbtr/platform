import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-[1400px] mx-auto w-full">
      {/* Header and Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Top Value Cards (Stats) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
        ))}
      </div>

      {/* Tabs and Table Controls */}
      <div className="space-y-4 pt-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[150px] rounded-md" />
          <Skeleton className="h-10 w-[150px] rounded-md" />
        </div>
        
        {/* Table Filters/Search */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Skeleton className="h-10 w-full max-w-[300px] rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px] rounded-md" />
            <Skeleton className="h-10 w-[120px] rounded-md" />
          </div>
        </div>

        {/* The Table Itself */}
        <div className="rounded-md border p-4 space-y-4">
          {/* Table Header */}
          <Skeleton className="h-10 w-full bg-muted/50" />
          {/* Table Rows (Simulating 5 rows) */}
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
