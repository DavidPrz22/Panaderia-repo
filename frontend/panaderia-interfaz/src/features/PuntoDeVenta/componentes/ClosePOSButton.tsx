import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useCerrarCajaMutation } from "../hooks/mutations/mutations";
import { Loader2 } from "lucide-react";

export const ClosePOSButton = () => {
    const [open, setOpen] = useState(false);
    const { mutateAsync: cerrarCaja, isPending } = useCerrarCajaMutation();

    const handleConfirm = async () => {
        try {
            await cerrarCaja({});
            setOpen(false);
        } catch (error) {
            console.error("Error closing POS:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="fixed top-4 left-(--close-pos-x) z-(--z-index-over-header-bar) cursor-pointer font-[Roboto] bg-blue-900 hover:bg-blue-800">
                    Cerrar Punto de Venta
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Estás seguro de cerrar el punto de venta?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                        Cancelar
                    </Button>
                    <Button
                        className="bg-blue-900 hover:bg-blue-800 cursor-pointer"
                        onClick={handleConfirm}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cerrando...
                            </>
                        ) : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};