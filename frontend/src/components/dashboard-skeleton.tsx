import { Skeleton } from "./ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background/50">
      <div className="max-w-full mx-auto p-4 flex min-h-screen">
        {/* Sidebar skeleton (hidden on small screens) */}
        <aside className="w-64 hidden md:flex flex-col gap-6 p-2">
          <div className="flex items-center gap-3 px-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-6 w-28 rounded-md" />
            </div>
          </div>

          <div className="space-y-3 px-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
            ))}
          </div>

          <div className="mt-auto px-2">
            <Skeleton className="h-8 w-full rounded-md" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-8 w-10 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          </div>
        </aside>

        {/* Main content skeleton - fills full height and is scrollable on small screens */}
        <main className="flex-1 flex flex-col min-vh overflow-auto">
          <div className="flex flex-col flex-1 space-y-6 p-2">
            {/* header (visible on all sizes) */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-48 rounded-md" />
                <Skeleton className="h-8 w-32 rounded-md" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-12 rounded-full" />
              </div>
            </div>

            {/* top area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </div>

            {/* stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>

            {/* main content: charts + list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-10 w-3/4 rounded-md" />
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/5 rounded-md" />
                      </div>
                      <Skeleton className="h-4 w-20 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* footer small cards pushed to bottom so skeleton expands to viewport bottom */}
            <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}