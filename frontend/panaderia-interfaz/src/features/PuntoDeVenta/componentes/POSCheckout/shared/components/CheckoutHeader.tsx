import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutHeaderProps {
    onBack: () => void;
}

export function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
    return (
        <Button variant="ghost" className="cursor-pointer fixed translate-y-[50%] top-0 z-header-bar ml-1" size="icon" onClick={onBack}>
            <ChevronLeft className="size-7" />
        </Button>
    );
}
