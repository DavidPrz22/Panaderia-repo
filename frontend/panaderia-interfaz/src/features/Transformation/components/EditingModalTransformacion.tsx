import { useTransformacionContext } from "@/context/TransformacionContext";
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

export default function EditingTransformacion() {
    const {
        editingTransformacion, setEditingTransformacion,
        formData, setFormData,
    } = useTransformacionContext();

    const updateMutation = useUpdateTransformacionMutation();

    const closeEditModal = () => {
        setEditingTransformacion(null);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: name === "cantidad_origen" || name === "cantidad_destino" ? Number(value) : value,
        }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev: any) => ({
            ...prev,
            activo: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingTransformacion || !formData) {
            return;
        }

        updateMutation.mutate({
            id: editingTransformacion.id,
            data: formData
        }, {
            onSuccess: () => {
                closeEditModal();
            }
        });
    };

    return (
        <Dialog open={!!editingTransformacion} onOpenChange={(open) => !open && closeEditModal()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Transformación</DialogTitle>
                </DialogHeader>

                {formData && (
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre_transformacion">Nombre de la Transformación</Label>
                            <Input
                                id="nombre_transformacion"
                                name="nombre_transformacion"
                                value={formData.nombre_transformacion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cantidad_origen">Cantidad Origen</Label>
                                <Input
                                    type="number"
                                    id="cantidad_origen"
                                    name="cantidad_origen"
                                    value={formData.cantidad_origen}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cantidad_destino">Cantidad Destino</Label>
                                <Input
                                    type="number"
                                    id="cantidad_destino"
                                    name="cantidad_destino"
                                    value={formData.cantidad_destino}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="activo"
                                checked={formData.activo}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <Label
                                htmlFor="activo"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Transformación activa
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={closeEditModal} disabled={updateMutation.isPending}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

