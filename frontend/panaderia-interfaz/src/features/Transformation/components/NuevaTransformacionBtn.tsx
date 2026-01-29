import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Plus, Loader2 } from "lucide-react";
import { useCreateTransformacionMutation } from "../hooks/mutations/mutations";
import { TransformacionSchema, type TTransformacionSchema } from "../schemas/schemas";

export const NuevaTransformacionBtn = () => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<TTransformacionSchema>({
        resolver: zodResolver(TransformacionSchema),
        mode: "onChange",
        defaultValues: {
            nombre_transformacion: "",
            cantidad_origen: 0,
            cantidad_destino: 0,
            activo: true,
            fecha_creacion: new Date()
        }
    });

    const createMutation = useCreateTransformacionMutation();

    const onSubmit = (data: TTransformacionSchema) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            }
        });
    };

    const loading = createMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) reset();
        }}>
            <DialogTrigger asChild>
                <Button
                    size={'lg'}
                    className="font-semibold bg-blue-600 text-white hover:bg-blue-500 cursor-pointer rounded-lg flex items-center gap-2"
                >
                    <Plus className="size-5" />
                    Nueva Transformación
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Agregar Nueva Transformación</DialogTitle>
                    <DialogDescription>
                        Ingrese los detalles para registrar una nueva transformación en el sistema.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre_transformacion" className="text-sm font-semibold">
                            Nombre de la Transformación *
                        </Label>
                        <Input
                            id="nombre_transformacion"
                            type="text"
                            placeholder="Ej. Producción de Pan"
                            {...register("nombre_transformacion")}
                            className={`focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-300 ${errors.nombre_transformacion ? 'border-red-500' : ''}`}
                        />
                        {errors.nombre_transformacion && (
                            <p className="text-xs text-red-500">{errors.nombre_transformacion.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="cantidad_origen" className="text-sm font-semibold">
                                Cantidad Origen
                            </Label>
                            <Input
                                type="number"
                                step="any"
                                id="cantidad_origen"
                                placeholder="0"
                                {...register("cantidad_origen", { valueAsNumber: true })}
                                className={`focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-300 ${errors.cantidad_origen ? 'border-red-500' : ''}`}
                            />
                            {errors.cantidad_origen && (
                                <p className="text-xs text-red-500">{errors.cantidad_origen.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cantidad_destino" className="text-sm font-semibold">
                                Cantidad Destino
                            </Label>
                            <Input
                                type="number"
                                step="any"
                                id="cantidad_destino"
                                placeholder="0"
                                {...register("cantidad_destino", { valueAsNumber: true })}
                                className={`focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-300 ${errors.cantidad_destino ? 'border-red-500' : ''}`}
                            />
                            {errors.cantidad_destino && (
                                <p className="text-xs text-red-500">{errors.cantidad_destino.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 cursor-pointer text-white min-w-[140px]"
                            disabled={loading || !isValid}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : "Guardar Transformación"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
