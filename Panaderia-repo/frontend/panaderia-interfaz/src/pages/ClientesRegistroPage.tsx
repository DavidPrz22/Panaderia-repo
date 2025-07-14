import { SIDEBAR_WIDTH } from "@/lib/constants";
import Sidebar from "../components/DashboardComponents/Sidebar/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientesRegistro from "@/components/DashboardComponents/VentasComponents/ClientesComponents/ClientesRegistro";
import { handleCrearCliente } from "@/lib/utils";
import type { Cliente } from "@/lib/types";

export default function ClientesRegistroPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Omit<Cliente, "id" | "fecha_registro">) => {
    setLoading(true);
    try {
      await handleCrearCliente(data);
      alert("Cliente creado exitosamente");
      navigate("/dashboard/clientes");
    } catch (error) {
      alert("Error al crear cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="flex min-h-screen bg">
        <div className={`flex-1 ml-64 p-4-[${SIDEBAR_WIDTH}px]`}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Registrar Nuevo Cliente
            </h2>
            <ClientesRegistro
              onSubmit={handleSubmit}
              onCancel={() => navigate("/dashboard/clientes/")}
              disabled={loading}
            />
            {loading && <div className="text-blue-500 mt-2">Guardando...</div>}
          </div>
        </div>
      </div>
    </>
  );
}
