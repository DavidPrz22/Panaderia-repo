import { useTransformacionContext } from "@/context/TransformacionContext";
import { updateTransformacion } from "../api/api";
import { CerrarIcon } from "@/assets/DashboardAssets";

export default function EditingTransformacion() {
    const {
        editingTransformacion, setEditingTransformacion,
        formData, setFormData,
        transformacion, setTransformacion,
        loading, setLoading,
        error, setError,
    } = useTransformacionContext();

const handleEdit = (transformacion) => {
        setEditingTransformacion(transformacion);
        setFormData({
            nombre_transformacion: transformacion.nombre_transformacion,
            cantidad_origen: transformacion.cantidad_origen,
            cantidad_destino: transformacion.cantidad_destino,
            activo: transformacion.activo,
        });
    };
    
    // Función para cerrar el modal de edición
    const closeEditModal = () => {
        setEditingTransformacion(null);
    };

    // Manejar cambios en el formulario
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        setFormData((prev: import("@/context/TransformacionContext").TransformacionForm | undefined) => ({
            ...(prev ?? {
                nombre_transformacion: "",
                cantidad_origen: 0,
                cantidad_destino: 0,
                activo: false,
            }),
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "cantidad_origen" || name === "cantidad_destino"
                    ? Number(value)
                    : value,
        }));
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingTransformacion) {
            setError("No hay transformación seleccionada para editar.");
            return;
        }

        if (!formData) {
            setError("Datos del formulario no válidos.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // Llamada a la API para actualizar
            const updatedTransformacion = await updateTransformacion(editingTransformacion.id, formData);

            // Actualiza el estado global con la transformación editada
            const updatedTransformaciones = transformacion.map(t => {
                const updated = t.id === editingTransformacion.id ? updatedTransformacion : t;
                return {
                    ...updated,
                    fecha_creacion: updated.fecha_creacion instanceof Date ? updated.fecha_creacion : new Date(updated.fecha_creacion)
                };
            });
            setTransformacion(updatedTransformaciones);
            closeEditModal();
            alert("Transformación actualizada correctamente");
        } catch (error: any) {
            console.error("Error actualizando transformación:", error);
            setError(error.message || "Error al actualizar la transformación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {editingTransformacion && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Editar Transformación</h2>
                            <button 
                                onClick={closeEditModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <img src={CerrarIcon} className="size-5" alt="Cerrar" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="nombre_transformacion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de la Transformación
                                </label>
                                <input
                                    type="text"
                                    id="nombre_transformacion"
                                    name="nombre_transformacion"
                                    value={formData.nombre_transformacion}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="cantidad_origen" className="block text-sm font-medium text-gray-700 mb-1">
                                    Cantidad Origen
                                </label>
                                <input
                                    type="number"
                                    id="cantidad_origen"
                                    name="cantidad_origen"
                                    value={formData.cantidad_origen}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="cantidad_destino" className="block text-sm font-medium text-gray-700 mb-1">
                                    Cantidad Destino
                                </label>
                                <input
                                    type="number"
                                    id="cantidad_destino"
                                    name="cantidad_destino"
                                    value={formData.cantidad_destino}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="activo"
                                    name="activo"
                                    checked={formData.activo}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                                    Transformación activa
                                </label>
                            </div>
                            
                            <div className="flex justify-end space-x-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
