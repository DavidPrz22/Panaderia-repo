interface SectionHeaderProps {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    count?: number;
}

export function SectionHeader({ icon: Icon, title, count }: SectionHeaderProps) {
    return (
        <div className="mb-3 flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-medium text-muted-foreground">
                {title} {count !== undefined && `(${count})`}
            </span>
        </div>
    );
}
