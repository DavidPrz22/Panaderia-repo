import { POSProductPanel } from "./POSProductPanel";
import { POSCartPanel } from "./POSCartPanel";

export default function POSInterfazVenta() {
    return (
        <div className="flex min-h-screen w-full bg-background">
            <div className="flex flex-1">
                <POSCartPanel />
                <POSProductPanel />
            </div>
        </div>
    )
}