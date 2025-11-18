import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DeleteOrdenCompraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  ordenCompraId: number;
  isLoading: boolean;
}

export const DeleteOrdenCompraDialog = ({
  open,
  onOpenChange,
  onConfirm,
  ordenCompraId,
  isLoading,
}: DeleteOrdenCompraDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar orden de compra {ordenCompraId}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La orden de compra será eliminada permanentemente del sistema.
            ¿Estás seguro de que deseas continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
            disabled={isLoading}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

