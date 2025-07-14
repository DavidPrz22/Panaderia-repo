import React from "react";
import type { Cliente } from "@/lib/types";

interface ClientesListaProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
}

const ClientesLista: React.FC<ClientesListaProps> = ({
  clientes,
  onEdit,
  onDelete,
}) => {
  if (clientes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay clientes registrados
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {clientes.map((cliente) => (
        <div
          key={cliente.id}
          className="p-4 border rounded-lg hover:bg-gray-50 transition flex justify-between items-center"
        >
          <div>
            <h3 className="font-medium text-gray-900">
              {cliente.nombre_cliente} {cliente.apellido_cliente}
            </h3>
            <p className="text-sm text-gray-600">Email: {cliente.email}</p>
            <p className="text-sm text-gray-600">
              Teléfono: {cliente.telefono}
            </p>
            <p className="text-sm text-gray-600">
              RIF/Cédula: {cliente.rif_cedula}
            </p>
            <p className="text-xs text-gray-400">
              Registrado: {cliente.fecha_registro}
            </p>
            <p className="text-sm text-gray-600">Notas: {cliente.notas}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(cliente)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(cliente.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientesLista;
