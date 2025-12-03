import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, MailIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef, useState } from "react";
import type { Proveedor } from "../types/types";
import { useForm } from "react-hook-form";
import { EmailSchema, type TEmailSchema } from "../schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEnviarEmailOCMutation } from "../hooks/mutations/mutations";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { HadleFilesConversion } from "@/utils/utils";
import { useEffect } from "react";
import { useComprasContext } from "@/context/ComprasContext";
import { getPDFAsBase64 } from "../utils/pdfUtils";

interface ComprasEmailModalProps {
  datos_proveedor: Proveedor;
}

export const ComprasEmailModal = ({
  datos_proveedor,
}: ComprasEmailModalProps) => {
  const { compraSeleccionadaId, ordenCompra } = useComprasContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [includePDF, setIncludePDF] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TEmailSchema>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: datos_proveedor.email_contacto,
      asunto: "Orden de Compra",
      mensaje: "Adjunto la orden de compra",
      attachments: [],
    },
  });

  useEffect(() => {
    const handleBase64Files = async () => {
      const base64Files = await HadleFilesConversion(files);
      if (base64Files && base64Files.length > 0) {
        setValue("attachments", base64Files);
      }
    };
    handleBase64Files();
  }, [files, setValue]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFiles(Array.from(files));
      setFileError(null);
    }
  };

  const handleFileDelete = (
    e: React.MouseEvent<HTMLDivElement>,
    fileName: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = files.filter((file) => file.name !== fileName);
    setFiles(newFiles);
  };

  const { mutateAsync: enviarEmailOC } = useEnviarEmailOCMutation();

  const handleFormSubmit = async (data: TEmailSchema) => {
    if (includePDF && ordenCompra) {
      const base64 = await getPDFAsBase64(ordenCompra);
      if (base64) {
        data.attachments?.push(base64);
      }
    }

    try {
      await enviarEmailOC({ id: compraSeleccionadaId!, params: data });
      toast.success("Email enviado exitosamente");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error al enviar el email");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
          <MailIcon className="size-5" />
          Enviar Email
        </Button>
      </DialogTrigger>
      <DialogContent
        className="z-[var(--z-index-over-header-bar)] h-[95vh] md:h-auto"
        overlayClassName="z-[var(--z-index-over-header-bar)]"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MailIcon className="size-5" />
              Enviar Correo a Proveedor
            </DialogTitle>
            <DialogDescription>
              Envía la orden de compra al proveedor por correo electrónico
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Correo del Proveedor
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Ingrese el email del proveedor"
                {...register("email")}
                className="bg-gray-50 focus-visible:ring-blue-200"
              />
              <span className="text-sm text-red-500">
                {errors.email?.message}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Asunto
              </Label>
              <Input
                type="text"
                id="email"
                placeholder="Ingrese el asunto del email"
                {...register("asunto")}
                className="bg-gray-50 focus-visible:ring-blue-200"
              />
              <span className="text-sm text-red-500">
                {errors.asunto?.message}
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Mensaje
              </Label>
              <Textarea
                id="email"
                placeholder="Ingrese el mensaje del email"
                {...register("mensaje")}
                rows={6}
                className="bg-gray-50 focus-visible:ring-blue-200 resize-none"
              />
              <span className="text-sm text-red-500">
                {errors.mensaje?.message}
              </span>
            </div>
            <Card className="bg-gray-50">
              <CardContent className="flex flex-col gap-2">
                <Label htmlFor="PDF" className="text-sm font-semibold">
                  <Checkbox
                    id="PDF"
                    checked={includePDF}
                    onCheckedChange={() => setIncludePDF(!includePDF)}
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  Adjuntar PDF de la orden de compra
                </Label>
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex w-full gap-2 h-auto cursor-pointer"
                >
                  {files.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {files.map((file) => (
                        <div
                          key={file.name}
                          className="text-sm font-semibold border px-2 py-1 border-gray-300 rounded-md flex items-center gap-2 justify-between"
                        >
                          <span>{file.name}</span>
                          <div onClick={(e) => handleFileDelete(e, file.name)}>
                            <Trash2Icon className="w-5 h-5 cursor-pointer text-red-500" />
                          </div>
                        </div>
                      ))}
                      <Input
                        type="file"
                        id="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFilesChange}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <FolderOpen className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        Seleccionar archivo
                      </span>
                      <Input
                        type="file"
                        id="file"
                        multiple
                        placeholder="Ingrese archivo adjunto"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFilesChange}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </>
                  )}
                </Button>
                <span className="text-sm text-red-500">{fileError}</span>
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setFiles([])}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              Enviar Email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
