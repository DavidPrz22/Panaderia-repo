import { POSProductPanel } from "./POSProductPanel";
import { POSCartPanel } from "./POSCartPanel";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aperturaCajaSchema } from "../schemas/schemas";
import { usePOSContext } from "@/context/POSContext";
import { CheckoutScreen } from "./POSCheckout";


export default function POSInterfazVenta() {

    const { watch, setValue } = useForm({
        resolver: zodResolver(aperturaCajaSchema),
    });
    const { showCheckout, setShowCheckout, setCarrito } = usePOSContext();

    const handleBackToCart = () => {
        setShowCheckout(false);
    };

    const handleCompleteCheckout = () => {
        setShowCheckout(false);
        setCarrito([]); // Clear cart after successful checkout
    };

    return (
        <div className="flex min-h-screen w-full bg-background">
            {showCheckout ? (
                <CheckoutScreen
                    onBack={handleBackToCart}
                    onComplete={handleCompleteCheckout}
                />
            ) :
                <div className="flex flex-1">
                    <POSCartPanel watch={watch} setValue={setValue} />
                    <POSProductPanel />
                </div>
            }
        </div>
    )
}