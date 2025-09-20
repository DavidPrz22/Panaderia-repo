import { useEffect } from "react";
import { useTransformacionContext } from "@/context/TransformacionContext";
import { getTransformaciones } from "../api/api";

export function TransformacionSelect() {
    const { transformacion, setTransformacion } = useTransformacionContext();
    const { loading, setLoading } = useTransformacionContext();
    const { error, setError } = useTransformacionContext();

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
  }, []); // Eliminé la dependencia a transformacion para evitar bucles infinitos

  return null; // Este componente solo carga datos, no renderiza UI
}

export default function Seleccion() {
    const { transformacion } = useTransformacionContext();
    const { loading, setLoading } = useTransformacionContext();

    return (
    <>
    <TransformacionSelect />
    <div className="flex items-start justify-start">
        <div className="flex flex-col items-start justify-start ml-80 border-2 border-gray-300 rounded-4xl w-300 h-100 p-6 mt-6 bg-white hover:shadow-2xl shadow-cyan-300">
            <span className="flex flex-col ml-10 text-2xl font-bold text-black-500">
                Seleccione Transformación
            {loading ? (
            <p className="mt-4 text-sm text-gray-500">Cargando transformaciones...</p>
            ) : (
            <select className="mt-4 items-center justify-center border border-gray-300 text-sm text-gray-500 rounded-md p-2 w-270">
                <option value="">Seleccione una transformación</option>
                {transformacion && transformacion.length > 0 ? (
                    transformacion.map((t) => (
                        <option key={t.id} value={t.id}>
                        {t.nombre_transformacion}
                        </option>
                ))
                ) : (
                <option value="" disabled>No hay transformaciones disponibles</option>
                )}
            </select>
            )}
        </span>

        <div className="flex ml-10 gap-20 mt-10">
            <span className="flex flex-col text-2xl font-bold text-black-500">
            Seleccione Producto de Origen
            </span>

            <span className="flex flex-col text-2xl font-bold text-black-500">
            Seleccione Producto Destino
            <input type="text" 
                className="mt-4 border border-gray-300 text-sm text-gray-500 rounded-md p-2"
            />
            </span>
        </div>
        </div>

        <div className="flex justify-between items-start -ml-85 mt-110 gap-2">
        <button className="flex items-center gap-3 bg-white-600 text-gray-600 border border-gray-300 px-4 py-2 h-10 rounded cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-gray-300">
            Cancelar
        </button>
        <button className="flex items-center gap-3 bg-blue-600 text-white border border-gray-300 px-4 py-2 w-55 h-10 rounded cursor-pointer shadow-md font-[Roboto] font-medium hover:bg-blue-300">
            Ejecutar Transformación
        </button>
        </div>
    </div>
    
    </>
    );
}
