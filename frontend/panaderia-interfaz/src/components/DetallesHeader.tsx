import Title from "@/components/Title";
import Button from "@/components/Button";
import { EditarIcon, BorrarIcon, CerrarIcon } from "@/assets/DashboardAssets";

interface DetallesHeaderProps {
  title?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
}

export const DetallesHeader = ({
  title,
  onEdit,
  onDelete,
  onClose,
}: DetallesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Title>{title}</Title>
      <div className="flex gap-2">
        {onEdit && (
          <Button type="edit" onClick={onEdit}>
            <div className="flex items-center gap-2">
              Editar
              <img src={EditarIcon} alt="Editar" />
            </div>
          </Button>
        )}
        {onDelete && (
          <Button type="delete" onClick={onDelete}>
            <div className="flex items-center gap-2">
              Eliminar
              <img src={BorrarIcon} alt="Eliminar" />
            </div>
          </Button>
        )}
        <div className="ml-6">
          <Button type="close" onClick={onClose}>
            <img src={CerrarIcon} alt="Cerrar" />
          </Button>
        </div>
      </div>
    </div>
  );
};
