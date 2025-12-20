import { POSProductPanel } from "./POSProductPanel";
import { POSCartPanel } from "./POSCartPanel";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aperturaCajaSchema } from "../schemas/schemas";
import { usePOSContext } from "@/context/POSContext";

export default function POSInterfazVenta() {

    const { watch, setValue } = useForm({
        resolver: zodResolver(aperturaCajaSchema),
    });
    const { carrito } = usePOSContext();
    console.log(watch(), carrito)
    return (
        <div className="flex min-h-screen w-full bg-background">
            <div className="flex flex-1">
                <POSCartPanel watch={watch} setValue={setValue}/>
                <POSProductPanel />
            </div>
        </div>
    )
}