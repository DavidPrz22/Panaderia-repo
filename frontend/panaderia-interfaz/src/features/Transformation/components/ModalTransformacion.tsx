import { useTransformacionContext } from "@/context/TransformacionContext"
import { deleteTransformacion, getTransformaciones, updateTransformacion } from "../api/api";
import { useEffect } from "react";
import { CerrarIcon } from "@/assets/DashboardAssets";
import { DotMenuIcon } from "@/assets/DashboardAssets";
import { ModalButtons } from "./ModalButtons";
import EditingModalTransformacion from "./EditingModalTransformacion";


export function ModalTransformacion({ children }: { children?: React.ReactNode }) {

    const { setTransformacion } = useTransformacionContext();
    const { setLoading } = useTransformacionContext();
    const { setError } = useTransformacionContext();


    useEffect(() => {
    async function fetchTransformaciones() {
        try {
        setLoading(true)
        setError(null);
        // Solo pasamos los parámetros necesarios para filtrar (si es necesario)
        const response = await getTransformaciones({ 
            nombre_transformacion: "", // Puedes cambiar esto para filtrar por nombre
            cantidad_origen: 0,
            cantidad_destino: 0,
            fecha_creacion: new Date(),
            activo: true
        });
        
        // Asegúrate de que response tiene el formato esperado
        console.log("Datos recibidos:", response);
        
        // Actualiza el estado con las transformaciones
        if (response && Array.isArray(response)) {
            const mapped = response.map((t: any) => ({
                ...t,
                fecha_creacion: new Date(t.fecha_creacion)
            }));
            setTransformacion(mapped);
        } else {
            console.error("Formato de respuesta inesperado:", response);
            setError("Formato de datos incorrecto");
        }
        } catch (error) {
        console.error("Error cargando transformaciones:", error);
        setError("Error al cargar las transformaciones");
        } finally {
        setLoading(false);
        }
    }
    
    fetchTransformaciones();
    }, [setTransformacion, setLoading, setError]);

    return children || null;
}


export default function Select() {
    const { transformacion, setTransformacion } = useTransformacionContext();
    const { loading, setLoading } = useTransformacionContext();
    const { setIsRegistroOpen } = useTransformacionContext();
    const { setError } = useTransformacionContext();
    const { editingTransformacion, setEditingTransformacion } = useTransformacionContext();
    const { formData, setFormData } = useTransformacionContext();

    


    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta transformación?")) {
            return;
        }
        
        try {
            setLoading(true);
            await deleteTransformacion(id);

            const updatedTransformaciones = transformacion
                .filter(t => t.id !== id)
                .map(t => ({
                    ...t,
                    fecha_creacion: t.fecha_creacion instanceof Date ? t.fecha_creacion : new Date(t.fecha_creacion)
                }));
            setTransformacion(updatedTransformaciones);
            
            alert("Transformación eliminada correctamente");
        } catch (error) {
            console.error("Error eliminando transformación:", error);
            setError("Error al eliminar la transformación");
        } finally {
            setLoading(false);
        }
    };
    
    const handleEdit = (t) => {
        setEditingTransformacion(t);
        setFormData({
            nombre_transformacion: t.nombre_transformacion,
            cantidad_origen: t.cantidad_origen,
            cantidad_destino: t.cantidad_destino,
            activo: t.activo,
        });
    };

    return(
        <>
        <ModalTransformacion />
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white border-2 border-gray-300 text-black items-start p-6 rounded-lg shadow-xl w-[80%] h-[75%]  overflow-y-auto relative">
        
        <div className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold">
            <button
                onClick={() => 
                    setIsRegistroOpen(false)}
                disabled={loading}
            >
                <img src={CerrarIcon} className="size-7" alt="Cerrar" />
            </button>
        </div>

        <div className="font-[Roboto] mb-2">
        <h2 className="text-lg font-semibold">Transformaciones Registradas</h2>
        <h1 className="text-sm text-gray-500">
            Lista de todas las producciones registradas en el sistema
        </h1>
        </div>

        <div className="w-full p-5 border border-gray-300 rounded-lg mt-4">
            <div className="flex items-center space-x-2 mb-5">
                <img src={DotMenuIcon} alt="menu" className="size-6" />
                <h2 className="font-semibold text-2xl">Transformaciones Registradas</h2>
            </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 ">
            {transformacion && transformacion.length > 0 ? (
                    transformacion.map((t) => (
                        <div key={t.id} className="border-2 border-blue-100 rounded-xl p-6 w-[90%] mx-auto hover:shadow-lg hover:border-blue-200 transition-[border, box-shadow] duration-300">
                        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
                {t.nombre_transformacion}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                t.activo 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
                {t.activo ? 'Activo' : 'Inactivo'}
            </span>
            </div>

            {/* Cantidades */}
            <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
                <p className="text-sm text-gray-600">Origen</p>
                <p className="text-2xl font-bold text-blue-600">{t.cantidad_origen}</p>
            </div>
            <div className="text-center">
                <p className="text-sm text-gray-600">Destino</p>
                <p className="text-2xl font-bold text-green-600">{t.cantidad_destino}</p>
            </div>
            </div>

            {/* Fecha */}
            <div className="border-t pt-3">
            <p className="text-sm text-gray-500">
                Creado: {t.fecha_creacion.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                    })}
            </p>
            <ModalButtons 
                onEdit={() => handleEdit(t)}
                onDelete={() => handleDelete(t.id)}
                loading={loading}
            />
            </div>

        </div>
        ))
                ) : (
                <div>No hay transformaciones disponibles</div>
            )}
        </div>
        </div>
        </div>
        </div>

                <EditingModalTransformacion />
        </>
    );
}