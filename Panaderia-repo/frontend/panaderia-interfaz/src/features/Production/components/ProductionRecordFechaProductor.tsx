import { UserIcon } from "@/assets/LoginRegisterAssets";
import { CalendarEmpty, CalendarFilled } from "@/assets/DashboardAssets";

export const ProductionRecordFechaProductor = ({
  fecha_produccion,
  fecha_vencimiento,
  registrado_por,
}: {
  fecha_produccion: string;
  fecha_vencimiento: string;
  registrado_por: string;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="flex items-center gap-2 text-sm">
        <img src={CalendarEmpty} className="size-4" alt="calendario" />
        <span className="">Producido:</span>
        <span className="font-medium">{fecha_produccion}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <img src={CalendarFilled} className="size-4" alt="calendario" />
        <span className="">Vence:</span>
        <span className="font-medium">{fecha_vencimiento}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <img src={UserIcon} className="h-4 w-4" />
        <span className="">Registrado por:</span>
        <span className="font-medium">{registrado_por}</span>
      </div>
    </div>
  );
};
