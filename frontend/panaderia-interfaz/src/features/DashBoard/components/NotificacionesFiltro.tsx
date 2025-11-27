import { 
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";

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
          <SelectItem value="2">Materia Prima</SelectItem>
          <SelectItem value="3">Producto Final</SelectItem>
          <SelectItem value="4">Producto Intermedio</SelectItem>
          <SelectItem value="5">Producto de Reventa</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};
