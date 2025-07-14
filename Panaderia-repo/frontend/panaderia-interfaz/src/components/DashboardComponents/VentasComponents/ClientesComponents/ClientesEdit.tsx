import ClientesRegistro from "./ClientesRegistro";
import type { Cliente } from "@/lib/types";

interface ClientesEditProps {
  cliente: Cliente;
  onSubmit: (data: Omit<Cliente, "id" | "fecha_registro">) => void;
  onCancel: () => void;
}

const ClientesEdit: React.FC<ClientesEditProps> = ({
  cliente,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Editar Cliente</h2>
      <ClientesRegistro
        onSubmit={onSubmit}
        clienteInicial={cliente}
        onCancel={onCancel}
      />
    </div>
  );
};

export default ClientesEdit;
