
import { useEffect } from "react";
import { useTransformacionContext } from "@/context/TransformacionContext";
import { createTransformacion } from "../api/api";
import { CerrarIcon } from "@/assets/DashboardAssets";

export const NuevaTransformacion = () => {
  const {
    nombre,
    setNombre,
    cantidadOrigen,
    setCantidadOrigen,
    cantidadDestino,
    setCantidadDestino,
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,
    isOpen,
    setIsOpen // Asegúrate de que esto esté en tu contexto
  } = useTransformacionContext();

  // Limpia los campos y estados relacionados
  const limpiarFormulario = () => {
    setNombre("");
    setCantidadOrigen("");
    setCantidadDestino("");
    setError(null);
    setSuccess(false);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    limpiarFormulario();
    setIsOpen(false);
  };

  useEffect(() => {
    limpiarFormulario();
  }, []); // Al montar el componente, limpia

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = {
        nombre_transformacion: nombre,
        cantidad_origen: Number(cantidadOrigen),
        cantidad_destino: Number(cantidadDestino),
        fecha_creacion: new Date(),
        activo: true,
      };
      const response = await createTransformacion(data);
      console.log('Transformación creada', response.data);
      setSuccess(true);
      limpiarFormulario();
    
      
    } catch (error) {
      setError(error.message || "Error al crear la transformación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-gray-300 text-black items-start p-6 rounded-lg shadow-xl w-full max-w-3xl h-90 overflow-y-auto relative">
        
        <button
          onClick={cerrarModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          disabled={loading}
        >
            <img src={CerrarIcon} className="size-7" alt="Cerrar" />
        </button>

        <h1 className="text-3xl font-semibold pr-8">Agregar Nueva Transformación</h1>
        
        <form onSubmit={onSubmit} className="mt-4 w-full items-start">
          <label className="flex items-start text-lg font-semibold mb-2">
            Nombre de la Transformación*
          </label>
          <input
            type="text"
            className="flex border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <div className="flex items-start justify-between mt-4 gap-9">
            <div className="flex-1">
              <label className="flex items-start text-lg font-semibold">
                Cantidad Origen
              </label>
              <input
                type="number"
                id="cantidad_origen"
                name="cantidad_origen"
                placeholder="0"
                value={cantidadOrigen}
                onChange={(e) => setCantidadOrigen(e.target.value)}
                className="w-85 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex-1">
              <label className="flex items-start text-lg font-semibold">
                Cantidad Destino
              </label>
              <input
                type="number"
                id="cantidad_destino"
                name="cantidad_destino"
                placeholder="0"
                value={cantidadDestino}
                onChange={(e) => setCantidadDestino(e.target.value)}
                className="w-85 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex mt-6 items-start justify-center w-full">
            <div className="flex flex-row gap-4">
              <button
                type="button" // Importante: especificar type="button" para que no envíe el formulario
                className="bg-white-600 border-2 border-blue-600 text-gray px-4 py-1 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={cerrarModal}
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="bg-blue-600 border-2 border-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-400 transition-colors"
                disabled={loading || !nombre || !cantidadOrigen || !cantidadDestino}
              >
                {loading ? "Guardando..." : "Aceptar"}
              </button>
            </div>
          </div>
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {success && (
          <p className="text-green-600 mt-4">
            Transformación agregada exitosamente.
          </p>
        )}
      </div>
    </div>
  );
};