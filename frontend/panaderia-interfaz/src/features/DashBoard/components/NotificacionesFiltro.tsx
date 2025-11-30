import { 
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";

import { PRODUCTOS_TIPOS } from "../utils/constants";
export const NotificacionesFiltro = ({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}) => {
  return (
    <>
      <Select value={value} onValueChange={(v) => onChange?.(v)}>
        <SelectTrigger className="cursor-pointer w-50 " id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Todas los productos</SelectItem>
          <SelectItem value="2">{PRODUCTOS_TIPOS.MATERIA_PRIMA}</SelectItem>
          <SelectItem value="3">{PRODUCTOS_TIPOS.PRODUCTOS_FINALES}</SelectItem>
          <SelectItem value="4">{PRODUCTOS_TIPOS.PRODUCTOS_INTERMEDIOS}</SelectItem>
          <SelectItem value="5">{PRODUCTOS_TIPOS.PRODUCTOS_REVENTA}</SelectItem>
          <SelectItem value="6">{PRODUCTOS_TIPOS.ORDENES_VENTA}</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};
