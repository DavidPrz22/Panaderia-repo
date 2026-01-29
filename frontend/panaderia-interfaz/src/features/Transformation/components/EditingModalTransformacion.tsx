import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useUpdateTransformacionMutation } from "../hooks/mutations/mutations";
import { TransformacionSchema, type TTransformacionSchema } from "../schemas/schemas";
import { Loader2 } from "lucide-react";
import type { Transformacion } from "../types/types";

interface EditingTransformacionProps {
    editingTransformacion: Transformacion | null;
    onClose: () => void;
}

export default function EditingTransformacion({ editingTransformacion, onClose }: EditingTransformacionProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isValid }
    } = useForm<any>({
        resolver: zodResolver(TransformacionSchema),
        mode: "onChange"
    });

    const updateMutation = useUpdateTransformacionMutation();

    useEffect(() => {
        if (editingTransformacion) {
            reset({
                nombre_transformacion: editingTransformacion.nombre_transformacion,
                cantidad_origen: Number(editingTransformacion.cantidad_origen),
                cantidad_destino: Number(editingTransformacion.cantidad_destino),
                activo: editingTransformacion.activo,
                fecha_creacion: new Date(editingTransformacion.fecha_creacion)
            });
        }
    }, [editingTransformacion, reset]);

    const onSubmit = (data: TTransformacionSchema) => {
        if (!editingTransformacion) return;

        updateMutation.mutate({
            id: editingTransformacion.id,
            data
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const activo = watch("activo");

    return (
        <Dialog open={!!editingTransformacion} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Editar Transformación</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit_nombre_transformacion" className="font-semibold">
                            Nombre de la Transformación
                        </Label>
                        <Input
                            id="edit_nombre_transformacion"
                            {...register("nombre_transformacion")}
                            className={errors.nombre_transformacion ? "border-red-500" : ""}
                        />
                        {errors.nombre_transformacion && (
                            <p className="text-xs text-red-500">{String(errors.nombre_transformacion.message)}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_cantidad_origen" className="font-semibold">Cantidad Origen</Label>
                            <Input
                                type="number"
                                step="any"
                                id="edit_cantidad_origen"
                                {...register("cantidad_origen", { valueAsNumber: true })}
                                className={errors.cantidad_origen ? "border-red-500" : ""}
                            />
                            {errors.cantidad_origen && (
                                <p className="text-xs text-red-500">{String(errors.cantidad_origen.message)}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit_cantidad_destino" className="font-semibold">Cantidad Destino</Label>
                            <Input
                                type="number"
                                step="any"
                                id="edit_cantidad_destino"
                                {...register("cantidad_destino", { valueAsNumber: true })}
                                className={errors.cantidad_destino ? "border-red-500" : ""}
                            />
                            {errors.cantidad_destino && (
                                <p className="text-xs text-red-500">{String(errors.cantidad_destino.message)}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <Checkbox
                            id="edit_activo"
                            checked={activo}
                            onCheckedChange={(checked) => setValue("activo", !!checked, { shouldValidate: true })}
                        />
                        <Label
                            htmlFor="edit_activo"
                            className="text-sm font-medium leading-none cursor-pointer"
                        >
                            Transformación activa
                        </Label>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onClose}
                            disabled={updateMutation.isPending}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateMutation.isPending || !isValid}
                            className="bg-blue-600 hover:bg-blue-500 text-white min-w-[120px] cursor-pointer"
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
