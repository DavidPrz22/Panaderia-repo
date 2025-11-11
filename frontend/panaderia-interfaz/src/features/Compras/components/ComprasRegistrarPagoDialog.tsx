import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { OrdenCompra } from "../types/types";
import { PagoSchema, type TPagoSchema } from "../schemas/schemas";

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
  const [fechaPago, setFechaPago] = useState<Date>(new Date());

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
      metodo_pago: ordenCompra.metodo_pago.nombre_metodo,
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
                Proveedor ID: {ordenCompra.proveedor.id}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_pago" className="text-sm font-medium">
                Fecha de Pago <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaPago && "text-muted-foreground",
                      errors.fecha_pago && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaPago ? (
                      format(fechaPago, "PPP", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaPago}
                    onSelect={(date) => {
                      if (date) {
                        setFechaPago(date);
                        setValue("fecha_pago", format(date, "yyyy-MM-dd"));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
              <Select
                defaultValue={ordenCompra.metodo_pago.nombre_metodo}
                onValueChange={(value) => setValue("metodo_pago", value)}
              >
                <SelectTrigger
                  className={errors.metodo_pago ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transferencia Bancaria">
                    Transferencia Bancaria
                  </SelectItem>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Tarjeta de Crédito">
                    Tarjeta de Crédito
                  </SelectItem>
                  <SelectItem value="Tarjeta de Débito">
                    Tarjeta de Débito
                  </SelectItem>
                </SelectContent>
              </Select>
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
              Referencia de Pago
            </Label>
            <Input
              id="referencia_pago"
              type="text"
              placeholder="Número de referencia, confirmación, etc."
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
                className={errors.monto ? "border-red-500" : ""}
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
                <SelectTrigger className={errors.moneda ? "border-red-500" : ""}>
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
                className={errors.tasa_cambio ? "border-red-500" : ""}
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
              className="resize-none"
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
              <span className="font-medium">{watch("metodo_pago")}</span>
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

