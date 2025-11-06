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

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  orderId: number;
  isLoadingCancelOrdenMutation: boolean;
}

export const CancelOrderDialog = ({
  open,
  onOpenChange,
  onConfirm,
  orderId,
  isLoadingCancelOrdenMutation,
}: CancelOrderDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cancelar orden {orderId}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción cancelará la orden. Los productos asignados serán
            liberados al stock. ¿Estás seguro de que deseas continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            No, mantener orden
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isLoadingCancelOrdenMutation}
          >
            Sí, cancelar orden
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
