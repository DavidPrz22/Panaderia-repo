import { User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientesQuery } from "../hooks/queries/queries";
import { useState } from "react";


type props = {
  onSetCliente: (clienteId: number) => void
}
export const POSCartPanelClientSelect = ({onSetCliente}: props) => {
    const { data: clientes } = useClientesQuery();
    const [selectedClient, setSelectedClient] = useState<string>('');
    
    const handleChangeClient = (client: string) => {
        setSelectedClient(client);
        onSetCliente(Number(client))
    }

    return (
        <div className="border-b border-border p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Cliente
            </label>
            <Select value={selectedClient} onValueChange={handleChangeClient}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes?.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.nombre_cliente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
    )
}