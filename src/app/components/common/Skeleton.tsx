export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="h-36 bg-gray-100 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-2/3 animate-pulse" />
        <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-4 bg-gray-100 rounded w-10 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-12 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
