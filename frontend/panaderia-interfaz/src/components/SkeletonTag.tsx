import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonTag({ width }: { width: number }) {
    return (
        <Skeleton className="rounded-xl" style={{ width }}/>
    )
}
