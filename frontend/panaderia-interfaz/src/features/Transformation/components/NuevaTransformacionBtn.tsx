import { useEffect, useRef } from "react";
import { useTransformacionContext } from "@/context/TransformacionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useCreateTransformacionMutation } from "../hooks/mutations/mutations";

export const NuevaTransformacionBtn = () => {
    const {
        isOpen, setIsOpen,
        nombre, setNombre,
        cantidadOrigen, setCantidadOrigen,
        cantidadDestino, setCantidadDestino,
    } = useTransformacionContext();

    const createMutation = useCreateTransformacionMutation();
    const timeoutRef = useRef<number | null>(null);

    const limpiarFormulario = () => {
        setNombre("");
        setCantidadOrigen("");
        setCantidadDestino("");
    };

    const cerrarModal = () => {
        limpiarFormulario();
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            limpiarFormulario();
        }
    }, [isOpen]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            nombre_transformacion: nombre,
            cantidad_origen: Number(cantidadOrigen),
            cantidad_destino: Number(cantidadDestino),
            fecha_creacion: new Date(),
            activo: true,
        };

        createMutation.mutate(data, {
            onSuccess: () => {
                timeoutRef.current = window.setTimeout(() => {
                    cerrarModal();
                }, 1000);
            }
        });
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const loading = createMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    size={'lg'}
                    className="font-semibold bg-blue-600 text-white hover:bg-blue-500 cursor-pointer rounded-lg flex items-center gap-2"
                >
                    <Plus className="size-5" />
                    Nueva Transformación
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Agregar Nueva Transformación</DialogTitle>
                    <DialogDescription>
                        Ingrese los detalles para registrar una nueva transformación en el sistema.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-sm font-semibold">
                            Nombre de la Transformación *
                        </Label>
                        <Input
                            id="nombre"
                            type="text"
                            placeholder="Ej. Producción de Pan"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-300"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="cantidad_origen" className="text-sm font-semibold">
                                Cantidad Origen
                            </Label>
                            <Input
                                type="number"
                                id="cantidad_origen"
                                placeholder="0"
                                value={cantidadOrigen}
                                onChange={(e) => setCantidadOrigen(e.target.value)}
                                className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-300"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cantidad_destino" className="text-sm font-semibold">
                                Cantidad Destino
                            </Label>
                            <Input
                                type="number"
                                id="cantidad_destino"
                                placeholder="0"
                                value={cantidadDestino}
                                onChange={(e) => setCantidadDestino(e.target.value)}
                                className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={cerrarModal}
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 cursor-pointer text-white"
                            disabled={loading || !nombre || !cantidadOrigen || !cantidadDestino}
                        >
                            {loading ? "Guardando..." : "Guardar Transformación"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
