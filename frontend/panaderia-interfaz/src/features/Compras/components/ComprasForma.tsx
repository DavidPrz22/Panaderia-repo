import { useEffect, useState } from "react";

import type { OrdenCompra, DetalleOC } from "../types/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  SelectItem,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { format } from "date-fns";
import { X, Plus, Trash2 } from "lucide-react";
import { PendingTubeSpinner } from "@/components/PendingTubeSpinner";

import { ComprasFormSelect } from "./ComprasFormSelect";
import { ComprasFormSearch } from "./ComprasFormSearch";
import { useGetParametros, useGetEstadosOrdenCompraRegistro, useGetBCVRate } from "../hooks/queries/queries";

import { useForm } from "react-hook-form";
import { OrdenCompraSchema, type TOrdenCompraSchema } from "../schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComprasFormDatePicker } from "./ComprasFormDatePicker";
import { toast } from "sonner";

// import { useCreateOrdenMutation, useUpdateOrdenMutation } from "../hooks/mutations/mutations";

interface ComprasFormProps {
  orden?: OrdenCompra;
  onClose: () => void;
}

export const ComprasForm = ({ orden, onClose }: ComprasFormProps) => {

  const {
    handleSubmit,
    watch,
    setValue,
  } = useForm<TOrdenCompraSchema>({
    resolver: zodResolver(OrdenCompraSchema),
    defaultValues:
      orden
        ? {
          }
        : {
            
          },
  });

  const isEdit = !!orden;
  const [{ data: proveedores }, { data: metodosDePago }] = useGetParametros();
  const { data: estadosOrden } = useGetEstadosOrdenCompraRegistro();
  const { data: bcvRate } = useGetBCVRate();

  // const { mutateAsync: createOrdenMutation, isPending: isCreatingOrden } = useCreateOrdenMutation();
  // const { mutateAsync: updateOrdenMutation, isPending: isUpdatingOrden } = useUpdateOrdenMutation();
  const [items, setItems] = useState<DetalleOC[]>(
    orden?.detalles.map((p, idx) => ({
      id: idx,
      materia_prima: p.materia_prima,
      materia_prima_nombre: p.materia_prima_nombre,
      producto_reventa: p.producto_reventa,
      producto_reventa_nombre: p.producto_reventa_nombre,
      cantidad_solicitada: p.cantidad_solicitada,
      cantidad_recibida: p.cantidad_recibida,
      unidad_medida_compra: p.unidad_medida_compra,
      unidad_medida_abrev: p.unidad_medida_abrev,
      costo_unitario_usd: p.costo_unitario_usd,
      subtotal_linea_usd: p.subtotal_linea_usd,
      notas: p.notas,
    })) || []
  );
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (bcvRate) {
      setValue('tasa_cambio_aplicada', roundTo3(bcvRate.promedio))
    }
  }, [bcvRate, setValue])


  const calculateTotal = () => {
    calculateTotalFromItems(items);
  };

  const roundTo3 = (n: number) => Math.round(n * 1000) / 1000;
  
  const calculateTotalFromItems = (itemsArray: DetalleOC[]) => {
    const subtotalBeforeFees = itemsArray.reduce((sum, item) => sum + (item.costo_unitario_usd * item.cantidad_solicitada), 0);
    
    setSubtotal(subtotalBeforeFees);
    setValue('monto_total_oc_usd', roundTo3(subtotalBeforeFees));
    setValue('monto_total_oc_ves', roundTo3((subtotalBeforeFees) * (Number(watch('tasa_cambio_aplicada')) || 0)));
  }

  useEffect(() => {
    if (orden) {
      calculateTotalFromItems(items)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addItem = () => {
    const newItem: DetalleOC = {
      id: items.length,
      materia_prima: 0,
      materia_prima_nombre: "",
      producto_reventa: 0,
      producto_reventa_nombre: "",
      cantidad_solicitada: 0,
      cantidad_recibida: 0,
      unidad_medida_compra: 0,
      unidad_medida_abrev: "",
      costo_unitario_usd: 0,
      subtotal_linea_usd: 0,
    };
    setItems([...items, newItem]);
  };
    console.log(watch('detalles'))
  const removeItem = (id: number) => {
    const newItems = items.filter((i) => i.id !== id);
    const newProductos = watch('detalles')?.filter((p) => p.id !== id) || [];
    
    setItems(newItems);
    setValue('detalles', newProductos);
    
    if (newProductos.length === 0) {
      resetAmounts();
    } else {
      calculateTotalFromItems(newItems);
    }
  };

  const resetAmounts = () => {
    setSubtotal(0)
    setValue('monto_impuestos_oc_usd', 0)
    setValue('monto_total_oc_usd', 0)
    setValue('monto_total_oc_ves', 0)
    setValue('subtotal_oc_usd', 0)
    setValue('subtotal_oc_ves', 0)
  }
  const calculateSubtotal = (item: DetalleOC) => {
    const subtotal = item.costo_unitario_usd * item.cantidad_solicitada
    return roundTo3(subtotal)
  }
  
  const handleSubmitForm = async (data: TOrdenCompraSchema) => {
    try {
      if (isEdit && orden) {
    
        // await updateOrdenMutation({ id: orden.id, data });
        toast.success("Orden actualizada exitosamente");
      } else {
        // await createOrdenMutation(data);
        toast.success("Orden creada exitosamente");
      }
      onClose();
    } catch {
      toast.error(isEdit ? "Error al actualizar la orden" : "Error al crear la orden");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="p-6 relative">
      {/* {(isCreatingOrden || isUpdatingOrden) && (
        <PendingTubeSpinner size={20} extraClass="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-50 z-50" />
      )} */}
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-card">
          <CardTitle className="text-2xl font-bold">
            {isEdit ? "Editar Orden" : "Nueva Orden"}
          </CardTitle>
          <Button className="cursor-pointer" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4 " />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit(handleSubmitForm) }>
          <CardContent className="space-y-6 pt-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <ComprasFormSelect id="cliente" value={watch("proveedor") ? watch("proveedor").toString() : ""} onChange={(v: string) => {
                  setValue("proveedor", Number(v))
                  }} placeholder="Selecciona un cliente">
                    {proveedores?.map((proveedor) => (
                      <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                        {proveedor.nombre_proveedor}
                      </SelectItem>
                    ))}
                  </ComprasFormSelect>
                
              </div>

              {/* Fecha de Orden */}
              <ComprasFormDatePicker 
                label="Fecha de Orden" 
                value={watch("fecha_emision_oc")} 
                onChange={(v) => setValue("fecha_emision_oc", v)} 
              />

              {/* Fecha de Entrega Solicitada */}
              <ComprasFormDatePicker 
                label="Fecha de Entrega Solicitada" 
                value={watch("fecha_entrega_esperada")} 
                onChange={(v) => setValue("fecha_entrega_esperada", v)} 
              />

              {/* Fecha de Entrega Definitiva */}
              <ComprasFormDatePicker 
                label="Fecha de Entrega Definitiva" 
                value={watch("fecha_entrega_real")!} 
                onChange={(v) => setValue("fecha_entrega_real", v)} 
                optional
              />

              {/* Estado de la Orden */}
              <div className="space-y-2">
                <Label htmlFor="estadoOrden">Estado *</Label>
                <ComprasFormSelect id="estadoOrden" value={watch("estado_oc") ? watch("estado_oc").toString() : ""} placeholder="Selecciona un estado" onChange={(v: string) => setValue("estado_oc", Number(v))}>
                    {estadosOrden?.map((estado) => (
                      <SelectItem key={estado.id} value={estado.id.toString()}>{estado.nombre_estado}</SelectItem>
                    ))}
                </ComprasFormSelect>
              </div>

              {/* Método de Pago */}
              <div className="space-y-2">
                <Label htmlFor="payment">Método de Pago *</Label>
                <ComprasFormSelect id="payment" value={watch("metodo_pago") ? watch("metodo_pago").toString() : ""} onChange={(v: string) => setValue("metodo_pago", Number(v))} placeholder="Selecciona un método de pago">
                    {metodosDePago?.map((metodo) => (
                      <SelectItem key={metodo.id} value={metodo.id.toString()}>{metodo.nombre_metodo}</SelectItem>
                    ))}
                </ComprasFormSelect>
              </div>
              {/* Referencia de Pago */}
              <div className="space-y-2">
                <Label htmlFor="payment">Terminos de Pago (Opcional)</Label>
                <Input
                  id="payment"
                  type="text"
                  value={watch("terminos_pago") ?? ""}
                  className="focus-visible:ring-blue-200"
                  onChange={(e) => setValue("terminos_pago", e.target.value || undefined)}
                  placeholder="Terminos de Pago"
                />
              </div>
            </div>

            {/* Order Lines */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Líneas de Productos</Label>
                <Button type="button" onClick={addItem} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Agregar Producto
                </Button>
              </div>

              <div className="border rounded-lg overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-table-header hover:bg-table-header bg-(--table-header-bg)">
                      <TableHead className="font-semibold">Producto *</TableHead>
                      <TableHead className="font-semibold w-24">Cantidad *</TableHead>
                      <TableHead className="font-semibold w-20">UdM</TableHead>
                      <TableHead className="font-semibold w-28">Costo UdM</TableHead>
                      <TableHead className="font-semibold w-28">Subtotal</TableHead>
                      <TableHead className="font-semibold w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <ComprasFormSearch value={item.materia_prima ? item.materia_prima_nombre : item.producto_reventa_nombre} onChange={
                            () => {}
                            } />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            className="focus-visible:ring-blue-200"
                            defaultValue={item.cantidad_solicitada}
                            onChange={(e) =>
                              {

                                const productoId = item.id!
                                
                                if (Number(e.target.value) < 0) {
                                  e.target.value = "0"
                                  toast.error("La Cantidad No Puede Ser Menor a 0")
                                  return
                                }

                                const productoIndex = watch("detalles")?.findIndex((p) => p.id === productoId)
                                if (productoIndex !== -1) {
                                  setValue(`detalles.${productoIndex}.cantidad_solicitada`, Number(e.target.value), { shouldValidate: true })
                                  item.cantidad_solicitada = Number(e.target.value)
                                  const subtotal = calculateSubtotal(item)
                                  item.subtotal_linea_usd = subtotal
                                }
                                calculateTotal();
                              }}
                          />
                        </TableCell>
                        <TableCell className="text-sm">{item.unidad_medida_abrev}</TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(item.costo_unitario_usd)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.subtotal_linea_usd)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            className="cursor-pointer"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id!)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">No hay productos</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                className="focus-visible:ring-blue-200"
                value={watch("notas")}
                onChange={(e) => setValue("notas", e.target.value)}
                placeholder="Notas adicionales sobre la orden..."
                rows={3}
              />
            </div>

            {/* Totals */}
            <div className="border-t pt-4 flex justify-end">
              <div className="grid grid-cols-2 gap-2">

                <div className="space-y-2 w-60">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tasa de Cambio VES: </span>
                    <span className="font-medium">{bcvRate?.promedio ? bcvRate.promedio.toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Total en VES: </span>
                    <span className="font-medium">{(Number(watch("monto_total_oc_ves")) || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 w-80">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(Number(subtotal) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impuestos:</span>
                    <span className="font-medium">{formatCurrency(Number(watch("monto_impuestos_oc_usd")) || 0)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(Number(watch("monto_total_oc_usd")) || 0)}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end border-t pt-4">
              <Button type="button" className="cursor-pointer" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="cursor-pointer bg-blue-600 hover:bg-blue-700">
                {isEdit ? "Actualizar Orden" : "Crear Orden"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

