import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePOSContext } from "@/context/POSContext";

export const POSProductPanelSearch = () => {
    
    const {search, setSearch} = usePOSContext();

    return (
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Buscar productos por nombre o SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10 text-base bg-card focus-visible:ring-blue-300"
            />
        </div>
    )
}