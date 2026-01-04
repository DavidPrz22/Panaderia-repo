import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => (
  <div className="p-6 border rounded-lg space-y-3 flex-1">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-3 w-full" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="p-6 border rounded-lg">
    <Skeleton className="h-[300px] w-full" />
  </div>
);

export const TableSkeleton = () => (
  <div className="p-6 border rounded-lg space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);
