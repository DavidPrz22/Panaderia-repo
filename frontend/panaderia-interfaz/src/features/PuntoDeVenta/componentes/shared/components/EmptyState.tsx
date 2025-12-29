import { ShoppingBag } from "lucide-react";

interface EmptyStateProps {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
}

export function EmptyState({
    icon: Icon = ShoppingBag,
    title,
    description
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">{title}</p>
            {description && (
                <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>
            )}
        </div>
    );
}
