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

export const ComprasEmailModal = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFiles(Array.from(files));
    }
  };

  return (
    <Dialog>
      <form action="">
        <DialogTrigger asChild>
          <Button className="flex gap-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            <MailIcon className="size-5" />
            Enviar Email
          </Button>
        </DialogTrigger>
        <DialogContent
          className="z-[var(--z-index-over-header-bar)] "
          overlayClassName="z-[var(--z-index-over-header-bar)]"
        >
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
                Correo del proveedor
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Ingrese el email del proveedor"
                className="bg-gray-50 focus-visible:ring-blue-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Asunto
              </Label>
              <Input
                type="text"
                id="email"
                placeholder="Ingrese el asunto del email"
                className="bg-gray-50 focus-visible:ring-blue-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Mensaje
              </Label>
              <Textarea
                id="email"
                placeholder="Ingrese el mensaje del email"
                rows={8}
                className="bg-gray-50 focus-visible:ring-blue-200"
              />
            </div>
            <Card className="bg-gray-50">
              <CardContent className="flex flex-col gap-2">
                <Label htmlFor="PDF" className="text-sm font-semibold">
                  <Checkbox
                    id="PDF"
                    defaultChecked
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  Adjuntar PDF de la orden de compra
                </Label>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex w-full gap-2 h-auto cursor-pointer"
                >
                  {files.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {files.map((file) => (
                        <span
                          key={file.name}
                          className="text-sm font-semibold border px-2 py-1 border-gray-300 rounded-md"
                        >
                          {file.name}
                        </span>
                      ))}
                      <Input
                        type="file"
                        id="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFilesChange}
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
                      />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
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
        </DialogContent>
      </form>
    </Dialog>
  );
};
