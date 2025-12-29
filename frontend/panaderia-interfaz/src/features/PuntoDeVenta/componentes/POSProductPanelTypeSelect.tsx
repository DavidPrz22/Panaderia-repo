import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePOSContext } from "@/context/POSContext";
import { type TipoProducto } from "../types/types";


export const POSProductPanelTypeSelect = () => {
    const {
        tipoProductoSeleccionado, 
        setTipoProductoSeleccionado,
        setCategoriaSeleccionada
    } = usePOSContext();

    return (
        <Select
              value={tipoProductoSeleccionado}
              onValueChange={(value: TipoProducto) => {
                setTipoProductoSeleccionado(value);
                setCategoriaSeleccionada(null);
              }}
            >
              <SelectTrigger className="w-48 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los Productos</SelectItem>
                <SelectItem value="final">Producto Final</SelectItem>
                <SelectItem value="reventa">Producto de Reventa</SelectItem>
              </SelectContent>
            </Select>
    )
}