import { Button } from "@/components/ui/button";
import { useEjecutarTransformacionMutation } from "../hooks/mutations/mutations";
import { Play } from "lucide-react";

interface BotonEjecutarTransformacionProps {
    transformacionId?: string | number;
    productoOrigenId?: string | number;
    productoDestinoId?: string | number;
    disabled?: boolean;
    onSuccess?: () => void;
}

export const BotonEjecutarTransformacion = ({
    transformacionId,
    productoOrigenId,
    productoDestinoId,
    disabled,
    onSuccess
}: BotonEjecutarTransformacionProps) => {
    const { mutate, isPending } = useEjecutarTransformacionMutation();

    const handleEjecutar = () => {
        if (transformacionId === undefined || productoOrigenId === undefined || productoDestinoId === undefined) return;

        mutate({
            transformacionId: Number(transformacionId),
            productoOrigenId: Number(productoOrigenId),
            productoDestinoId: Number(productoDestinoId)
        }, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            }
        });
    };

    const isButtonDisabled = disabled || isPending || !transformacionId || !productoOrigenId || !productoDestinoId;

    return (
        <Button
            className="flex items-center gap-3 bg-blue-600 text-white px-4 py-2 h-10 rounded-lg cursor-pointer shadow-md font-[Roboto] font-medium hover:bg-blue-500"
            onClick={handleEjecutar}
            disabled={isButtonDisabled}
        >
            {isPending ? (
                <>
                    <span className="animate-spin mr-2">⏳</span>
                    Ejecutando...
                </>
            ) : (
                <>
                    <Play className="size-4" />
                    Ejecutar Transformación
                </>
            )}
        </Button>
    );
};
