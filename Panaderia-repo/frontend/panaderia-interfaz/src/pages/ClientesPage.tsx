import { SIDEBAR_WIDTH } from "@/lib/constants";
import Sidebar from "../components/DashboardComponents/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import ClientesLista from "../components/DashboardComponents/VentasComponents/ClientesComponents/ClientesLista";
import ClientesEdit from "../components/DashboardComponents/VentasComponents/ClientesComponents/ClientesEdit";
import { useNavigate } from "react-router-dom";
import {
  handleClientesList,
  handleActualizarCliente,
  handleEliminarCliente,
} from "@/lib/utils";
import type { Cliente } from "@/lib/types";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();

  // Cargar clientes
  const cargarClientes = async () => {
    try {
      const data = await handleClientesList();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Actualizar cliente
  const handleEditSubmit = async (
    data: Omit<Cliente, "id" | "fecha_registro">
  ) => {
    if (!editingCliente) return;
    try {
      await handleActualizarCliente(editingCliente.id, data);
      alert("Cliente actualizado exitosamente");
      setShowEdit(false);
      setEditingCliente(null);
      cargarClientes();
    } catch (error) {
      alert("Error al actualizar cliente");
    }
  };

  // Eliminar cliente
  const eliminarCliente = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      try {
        await handleEliminarCliente(id);
        alert("Cliente eliminado exitosamente");
        cargarClientes();
      } catch (error) {
        alert("Error al eliminar cliente");
      }
    }
  };

  // Iniciar edición
  const iniciarEdicion = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowEdit(true);
  };

  if (loading) {
    return <div className="p-4">Cargando clientes...</div>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex min-h-screen bg">
        <div className={`flex-1 ml-64 p-4-[${SIDEBAR_WIDTH}px]`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Gestión de Clientes
              </h1>
              <button
                onClick={() => navigate("/clientes/registro")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Nuevo Cliente
              </button>
            </div>
            {showEdit && editingCliente && (
              <ClientesEdit
                cliente={editingCliente}
                onSubmit={handleEditSubmit}
                onCancel={() => {
                  setShowEdit(false);
                  setEditingCliente(null);
                }}
              />
            )}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  Lista de Clientes
                </h2>
              </div>
              <div className="p-6">
                <ClientesLista
                  clientes={clientes}
                  onEdit={iniciarEdicion}
                  onDelete={eliminarCliente}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
