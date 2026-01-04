import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const CardSkeleton = () => (
  <Card className="shadow-none flex-1 border-gray-300">
    <CardContent className="h-full flex flex-col justify-between p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </CardContent>
  </Card>
);

export const ChartSkeleton = () => (
  <Card className="w-full h-full border-gray-200 shadow-sm p-6 overflow-hidden">
    <div className="mb-6">
      <Skeleton className="h-7 w-64" />
    </div>
    <div className="flex-1 w-full min-h-0 relative">
      <Skeleton className="h-full w-full rounded-md" />
    </div>
  </Card>
);

export const TableSkeleton = () => (
  <Card className="w-full h-full border-gray-200 shadow-sm flex flex-col overflow-hidden">
    <div className="p-6 pb-4">
      <Skeleton className="h-7 w-48" />
    </div>
    <div className="flex-1 px-6 pb-6 space-y-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  </Card>
);
