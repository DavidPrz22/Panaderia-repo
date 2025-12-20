import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonCardProps {
    width?: number | string
    height?: number | string
    className?: string
}

export function SkeletonCard({ width, height, className }: SkeletonCardProps) {
    return (
        <Skeleton className={cn("rounded-xl", className)} style={{ width, height }} />
    )
}
