import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCerrarCajaMutation } from "../hooks/mutations/mutations";
import { Loader2 } from "lucide-react";
import { cierreCajaSchema, type TCierreCaja } from "../schemas/schemas";

export const ClosePOSButton = () => {
    const [open, setOpen] = useState(false);
    const { mutateAsync: cerrarCaja, isPending } = useCerrarCajaMutation();

    const form = useForm<TCierreCaja>({
        resolver: zodResolver(cierreCajaSchema),
        defaultValues: {
            notas_cierre: "",
        },
    });

    const onSubmit = async (data: TCierreCaja) => {
        try {
            await cerrarCaja(data);
            setOpen(false);
            form.reset();
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cerrar Punto de Venta</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="notas_cierre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas de Cierre (Opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ingresa cualquier observación sobre el cierre..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-900 hover:bg-blue-800 cursor-pointer"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cerrando...
                                    </>
                                ) : "Confirmar Cierre"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};