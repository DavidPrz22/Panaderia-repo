import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { MetodoDePago, OrdenCompra } from "../types/types";
import { PagoSchema, type TPagoSchema } from "../schemas/schemas";
import { ComprasFormDatePicker } from "./ComprasFormDatePicker";
import { ComprasFormSelect } from "./ComprasFormSelect";
import { useGetParametros } from "../hooks/queries/queries";
import { cn } from "@/lib/utils";


interface ComprasRegistrarPagoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordenCompra: OrdenCompra;
  onSubmit: (data: TPagoSchema) => Promise<void>;
}

export const ComprasRegistrarPagoDialog = ({
  open,
  onOpenChange,
  ordenCompra,
  onSubmit,
}: ComprasRegistrarPagoDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMoneda, setSelectedMoneda] = useState<string>("USD");
  const [monto, setMonto] = useState<string>("");
  const [tasaCambio, setTasaCambio] = useState<string>(
    ordenCompra.tasa_cambio_aplicada.toString(),
  );

  const parametros = useGetParametros();
  const metodosDePago = parametros[1].data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TPagoSchema>({
    resolver: zodResolver(PagoSchema),
    defaultValues: {
      fecha_pago: new Date().toISOString().split("T")[0],
      metodo_pago: ordenCompra.metodo_pago.id,
      monto: Number(ordenCompra.monto_total_oc_usd),
      moneda: "USD",
      tasa_cambio: Number(ordenCompra.tasa_cambio_aplicada),
      referencia_pago: "",
      notas_pago: "",
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate equivalent in VES
  const calcularEquivalenteVES = () => {
    const montoNum = parseFloat(monto) || 0;
    const tasaNum = parseFloat(tasaCambio) || 0;
    return montoNum * tasaNum;
  };

  const handleFormSubmit = async (data: TPagoSchema) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Error registrando pago:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMonto(value);
    setValue("monto", parseFloat(value) || 0);
  };

  const handleTasaCambioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTasaCambio(value);
    setValue("tasa_cambio", parseFloat(value) || 0);
  };

  const handleMonedaChange = (value: string) => {
    setSelectedMoneda(value);
    setValue("moneda", value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
          className="z-[var(--z-index-over-header-bar)] max-w-xl md:max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 "
          overlayClassName="z-[var(--z-index-over-header-bar)] ">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Registrar Pago - Orden OC-{ordenCompra.id.toString().padStart(3, "0")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Proveedor and Total Section */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Proveedor</p>
              <p className="font-semibold">
                {ordenCompra.proveedor.nombre_proveedor}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total de la Orden
              </p>
              <p className="text-lg font-bold">
                ${formatCurrency(ordenCompra.monto_total_oc_usd)}
              </p>
            </div>
          </div>

          {/* Payment Date and Method */}
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="space-y-2">
              <ComprasFormDatePicker
                label="Fecha de Pago"
                value={watch("fecha_pago")}
                onChange={(v) => setValue("fecha_pago", v)}
              />
              {errors.fecha_pago && (
                <p className="text-sm text-red-500">
                  {errors.fecha_pago.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodo_pago" className="text-sm font-medium">
                Método de Pago <span className="text-red-500">*</span>
              </Label>
              <ComprasFormSelect
                id="metodo_pago"
                value={watch("metodo_pago") ? watch("metodo_pago").toString() : ""}
                onChange={(v: string) => setValue("metodo_pago", Number(v))}
                placeholder="Selecciona método de pago"
              >
                {metodosDePago.map((metodo: MetodoDePago) => (
                  <SelectItem key={metodo.id} value={metodo.id.toString()}>
                    {metodo.nombre_metodo}
                  </SelectItem>
                ))}
              </ComprasFormSelect>
              {errors.metodo_pago && (
                <p className="text-sm text-red-500">
                  {errors.metodo_pago.message}
                </p>
              )}
            </div>
          </div>

          {/* Payment Reference */}
          <div className="space-y-2">
            <Label htmlFor="referencia_pago" className="text-sm font-medium">
              Referencia de Pago <span className="text-red-500">*</span>
            </Label>
            <Input
              id="referencia_pago"
              type="text"
              placeholder="Número de referencia, confirmación, etc."
              className="focus-visible:ring-blue-200"
              {...register("referencia_pago")}  
            />
          </div>

          {/* Amount, Currency and Exchange Rate */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monto" className="text-sm font-medium">
                Monto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={monto}
                onChange={handleMontoChange}
                className={cn(errors.monto ? "border-red-500" : "", "focus-visible:ring-blue-200")}
              />
              {errors.monto && (
                <p className="text-sm text-red-500">{errors.monto.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="moneda" className="text-sm font-medium">
                Moneda <span className="text-red-500">*</span>
              </Label>
              <Select
                defaultValue="USD"
                onValueChange={handleMonedaChange}
              >
                <SelectTrigger className={cn(errors.moneda ? "border-red-500" : "", "focus-visible:ring-blue-200")}>
                  <SelectValue placeholder="Moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - Dólar</SelectItem>
                  <SelectItem value="VES">VES - Bolívar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
              {errors.moneda && (
                <p className="text-sm text-red-500">{errors.moneda.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tasa_cambio" className="text-sm font-medium">
                Tasa de Cambio
              </Label>
              <Input
                id="tasa_cambio"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={tasaCambio}
                onChange={handleTasaCambioChange}
                className={cn(errors.tasa_cambio ? "border-red-500" : "", "focus-visible:ring-blue-200")}
              />
              {errors.tasa_cambio && (
                <p className="text-sm text-red-500">
                  {errors.tasa_cambio.message}
                </p>
              )}
            </div>
          </div>

          {/* Equivalent in VES */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">
                Equivalente en VES:
              </span>
              <span className="text-lg font-bold text-blue-900">
                {formatCurrency(calcularEquivalenteVES())} VES
              </span>
            </div>
          </div>

          {/* Payment Notes */}
          <div className="space-y-2">
            <Label htmlFor="notas_pago" className="text-sm font-medium">
              Notas del Pago
            </Label>
            <Textarea
              id="notas_pago"
              placeholder="Notas adicionales sobre el pago..."
              {...register("notas_pago")}
              rows={3}
              className="resize-none focus-visible:ring-blue-200"
            />
          </div>

          {/* Payment Summary */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-semibold mb-3">Resumen del Pago</h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monto a pagar:</span>
              <span className="font-medium">
                {monto || "0.00"} {selectedMoneda}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método:</span>
              <span className="font-medium">{metodosDePago.find(metodo => metodo.id === watch("metodo_pago"))?.nombre_metodo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-medium">
                {watch("fecha_pago")
                  ? new Date(watch("fecha_pago")).toLocaleDateString("es-VE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white ml-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrar Pago"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

