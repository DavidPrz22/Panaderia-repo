import Button from "@/components/Button";
import type { ProductosIntermediosFormSharedProps } from "@/features/ProductosIntermedios/types/types";

export default function ProductosIntermediosFormShared(
    {
        title,
        isUpdate=false,
        onClose,
        onSubmitSuccess,
    }: ProductosIntermediosFormSharedProps
) {

    const handleCancelButtonClick = () => {
        onClose();
    }

    return (
        <form
          onSubmit={() => {}}
          id="productos-intermedios-form"
          className="relative "
        >
          <div className="flex flex-col mx-8 mt-4 rounded-md border border-gray-200 shadow-md">
            <div className="p-5 font-[Roboto] text-lg font-semibold border-b border-gray-300 bg-gray-50 rounded-t-md">
              {title}
            </div>
            <div className="flex flex-col gap-2 px-5 bg-white">
              <div className="flex flex-col gap-2 border-b border-gray-300 py-8">
                {isUpdate ? (
                    <div>
                        <h1>Update</h1>
                    </div>
                ) : (
                    <div>
                        <h1>Create</h1>
                    </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end py-4 px-5 bg-white">
              <Button type="cancel" onClick={handleCancelButtonClick}>
                Cancelar
              </Button>
              <Button type="submit" onClick={() => {}}>
                Guardar
              </Button>
            </div>
          </div>
        </form>
      );
}