import { useTransformacionContext } from "@/context/TransformacionContext";
import { Button } from "@/components/ui/button";
import { ListIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type { Transformacion } from "../types/types";
import { ModalButtons } from "./ModalButtons";
import EditingModalTransformacion from "./EditingModalTransformacion";
import { DotMenuIcon } from "@/assets/DashboardAssets";
import { useTransformacionesQuery } from "../hooks/queries/TransformacionQueries";
import { useDeleteTransformacionMutation } from "../hooks/mutations/mutations";

export const RegistrosBtn = () => {
    const {
        isRegistroOpen, setIsRegistroOpen,
        setEditingTransformacion,
        setFormData
    } = useTransformacionContext();

    const { data: transformacion, isLoading } = useTransformacionesQuery();
    const deleteMutation = useDeleteTransformacionMutation();

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta transformación?")) {
            return;
        }
        deleteMutation.mutate(id);
    };

    const handleEdit = (t: Transformacion) => {
        setEditingTransformacion(t);
        setFormData({
            nombre_transformacion: t.nombre_transformacion,
            cantidad_origen: t.cantidad_origen,
            cantidad_destino: t.cantidad_destino,
            activo: t.activo,
        });
    };

    return (
        <Dialog open={isRegistroOpen} onOpenChange={setIsRegistroOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size='lg'
                    className="flex items-center gap-3 cursor-pointer bg-white text-gray-800 border-gray-300 font-semibold hover:bg-gray-50 transition-colors"
                >
                    <ListIcon className="size-5" />
                    <span>Ver Transformaciones</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[80%] h-[85vh] flex flex-col p-6 overflow-hidden">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <img src={DotMenuIcon} alt="Icono" className="size-6" />
                        Transformaciones Registradas
                    </DialogTitle>
                    <DialogDescription>
                        Lista de todas las producciones registradas en el sistema
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid gap-4">
                        {transformacion && transformacion.length > 0 ? (
                            transformacion.map((t) => (
                                <div key={t.id} className="border border-blue-100 rounded-xl p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {t.nombre_transformacion}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.activo
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {t.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 bg-blue-50/50 rounded-lg">
                                            <p className="text-sm text-gray-600">Origen</p>
                                            <p className="text-2xl font-bold text-blue-600">{t.cantidad_origen}</p>
                                        </div>
                                        <div className="text-center p-3 bg-green-50/50 rounded-lg">
                                            <p className="text-sm text-gray-600">Destino</p>
                                            <p className="text-2xl font-bold text-green-600">{t.cantidad_destino}</p>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            {new Date(t.fecha_creacion).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <ModalButtons
                                            onEdit={() => handleEdit(t as any)}
                                            onDelete={() => handleDelete(t.id)}
                                            loading={deleteMutation.isPending}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 italic">
                                {isLoading ? "Cargando..." : "No hay transformaciones disponibles"}
                            </div>
                        )}
                    </div>
                </div>

                <EditingModalTransformacion />
            </DialogContent>
        </Dialog>
    );
};
