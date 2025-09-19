import { BoxIcon, TrashIcon } from "@/assets/DashboardAssets";
import Button from "@/components/Button";

export const ProductionRecordHeader = ({
  nombre,
  descripcion,
}: {
  nombre: string;
  descripcion: string;
}) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center">
          <div className="p-3 bg-blue-500 rounded-full">
            <img src={BoxIcon} className="size-6" alt="caja" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">{nombre}</h3>
          <p className="text-sm text-gray-600">{descripcion}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-2">
          <Button type="delete" onClick={() => {}}>
            {/* <Trash2 className="h-4 w-4" /> */}
            <img src={TrashIcon} className="size-6" alt="Eliminar Registro" />
          </Button>
        </div>
      </div>
    </div>
  );
};
