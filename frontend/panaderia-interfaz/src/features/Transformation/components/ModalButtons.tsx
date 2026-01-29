import { Button } from "@/components/ui/button";

interface ModalButtonsProps {
    onEdit: () => void;
    onDelete: () => void;
    loading: boolean;
}

export const ModalButtons = ({ onEdit, onDelete, loading }: ModalButtonsProps) => {
    return (
        <div className="flex gap-2 justify-end">
            <Button
                variant="outline"
                className="text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                onClick={onEdit}
                disabled={loading}
            >
                Modificar
            </Button>
            <Button
                variant="destructive"
                className='cursor-pointer'
                onClick={onDelete}
                disabled={loading}
            >
                Eliminar
            </Button>
        </div>
    );
};


