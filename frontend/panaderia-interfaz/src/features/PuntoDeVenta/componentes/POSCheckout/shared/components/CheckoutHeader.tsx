import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutHeaderProps {
    onBack: () => void;
    title?: string;
}

export function CheckoutHeader({ onBack, title = "Finalizar Venta" }: CheckoutHeaderProps) {
    return (
        <div className="flex items-center gap-4 border-y border-border bg-card mt-3 px-6">
            <Button variant="ghost" className="cursor-pointer" size="icon" onClick={onBack}>
                <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
        </div>
    );
}
