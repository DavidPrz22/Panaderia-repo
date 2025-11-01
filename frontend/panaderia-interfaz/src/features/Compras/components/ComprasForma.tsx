import { useEffect, useState } from "react";

import type { OrdenCompra, DetalleOC, Producto } from "../types/types";

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

import { X, Plus, Trash2 } from "lucide-react";
import { PendingTubeSpinner } from "@/components/PendingTubeSpinner";

import { ComprasFormSelect } from "./ComprasFormSelect";
import { ComprasFormSearch } from "./ComprasFormSearch";
import { ComprasFormTotals } from "./ComprasFormTotals";
import { useGetParametros, useGetEstadosOrdenCompraRegistro, useGetBCVRate } from "../hooks/queries/queries";

import { useForm } from "react-hook-form";
import { OrdenCompraSchema, type TOrdenCompraSchema } from "../schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComprasFormDatePicker } from "./ComprasFormDatePicker";
import { toast } from "sonner";

import { useCreateOCMutation } from "../hooks/mutations/mutations";
import { useComprasFormLogic } from "../hooks/useComprasFormLogic";
import { 
  updateItemFromProducto, 
  findProductoIndex,
  createNewDetalleOC 
} from "../utils/itemHandlers";
import { useComprasContext } from "@/context/ComprasContext";

interface ComprasFormProps {
  orden?: OrdenCompra;
  onClose: () => void;
}

export const ComprasForm = ({ orden, onClose }: ComprasFormProps) => {

  const { setOrdenCompra, setShowOrdenCompraDetalles, setShowForm } = useComprasContext();

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
          fecha_emision_oc: new Date().toISOString().split('T')[0],
          fecha_entrega_esperada: new Date().toISOString().split('T')[0],
          estado_oc: 1,
          metodo_pago: 1,
          subtotal_oc_usd: 0,
          subtotal_oc_ves: 0,
          monto_total_oc_usd: 0,
          monto_total_oc_ves: 0,
          monto_impuestos_oc_usd: 0,
          monto_impuestos_oc_ves: 0,
          tasa_cambio_aplicada: 0,
          direccion_envio: undefined,
          terminos_pago: undefined,
          notas: undefined,
          fecha_entrega_real: undefined,
          },
  });

  const isEdit = !!orden;
  const [{ data: proveedores }, { data: metodosDePago }, { data: unidadesMedida }] = useGetParametros();
  const { data: estadosOrden } = useGetEstadosOrdenCompraRegistro();
  const { data: bcvRate } = useGetBCVRate();

  const { mutateAsync: createOCMutation, isPending: isCreatingOCMutation } = useCreateOCMutation();
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
      porcentaje_impuesto: p.porcentaje_impuesto,
      impuesto_linea_usd: p.impuesto_linea_usd,
    })) || []
  );
  const [subtotal, setSubtotal] = useState(0);

  const formLogic = useComprasFormLogic({
    setValue,
    watch,
    items,
    setSubtotal,
  });

  const {
    roundTo3,
    calculateTotalFromItems,
    updateItemCalculations,
    updateFormDetalles,
    resetAmounts,
  } = formLogic;

  useEffect(() => {
    if (bcvRate) {
      setValue('tasa_cambio_aplicada', roundTo3(bcvRate.promedio))
    }
  }, [bcvRate, setValue, roundTo3])

  useEffect(() => {
    if (orden) {
      calculateTotalFromItems(items)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addItem = () => {
    const newItem = createNewDetalleOC(items.length);
    setItems([...items, newItem]);
  };

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
  const handleSubmitForm = async (data: TOrdenCompraSchema) => {
    try {
      if (isEdit && orden) {
    
        // await updateOrdenMutation({ id: orden.id, data });
        toast.success("Orden actualizada exitosamente");
      } else {
        const { orden } = await createOCMutation(data);
        setOrdenCompra(orden);
        setShowForm(false);
        toast.success("Orden creada exitosamente");
      }
    } catch (error) {
      console.error("Error creating orden compra:", error);
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
      {(isCreatingOCMutation) && (
        <PendingTubeSpinner size={20} extraClass="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-50 z-50" />
      )}
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
                  className="focus-visible:ring-blue-200 bg-gray-50"
                  onChange={(e) => setValue("terminos_pago", e.target.value || undefined)}
                  placeholder="Terminos de Pago"
                />
              </div>

              {/* Direccion de Envio */}
              <div className="space-y-2">
                <Label htmlFor="payment">Direccion de Envio (Opcional)</Label>
                <Input
                  id="payment"
                  type="text"
                  value={watch("direccion_envio") ?? ""}
                  className="focus-visible:ring-blue-200 bg-gray-50"
                  onChange={(e) => setValue("direccion_envio", e.target.value || undefined)}
                  placeholder="Direccion de Envio"
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
                      <TableHead className="font-semibold w-28">Impuesto %</TableHead>
                      <TableHead className="font-semibold w-28">Subtotal</TableHead>
                      <TableHead className="font-semibold w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <ComprasFormSearch 
                            value={item.materia_prima_nombre || item.producto_reventa_nombre} 
                            onChange={(producto: Producto) => {
                              const productoId = item.id;

                              const isDuplicate = items.some((existingItem) => {
                                if (existingItem.id === productoId) return false;
                                
                                if (producto.tipo === 'materia-prima') {
                                  return existingItem.materia_prima === producto.id;
                                } else {
                                  return existingItem.producto_reventa === producto.id;
                                }
                              });

                              if (isDuplicate) {
                                toast.error("El Producto Ya Existe en la Orden");
                                return;
                              }

                              const productoIndex = findProductoIndex(watch, productoId);

                              updateItemFromProducto(item, producto);
                              setItems([...items]);

                              const calculations = updateItemCalculations(item);
                              
                              updateFormDetalles(items, productoIndex, calculations);
                              calculateTotalFromItems(items);
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            className="focus-visible:ring-blue-200"
                            defaultValue={item.cantidad_solicitada}
                            onChange={(e) => {
                              const productoId = item.id;
                              const value = Number(e.target.value);
                              
                              if (value < 0) {
                                e.target.value = "0";
                                toast.error("La Cantidad No Puede Ser Menor a 0");
                                return;
                              }

                              const productoIndex = findProductoIndex(watch, productoId);
                              if (productoIndex !== -1) {
                                item.cantidad_solicitada = value;
                                const calculations = updateItemCalculations(item);
                                
                                updateFormDetalles(items, productoIndex, calculations, {
                                  cantidad_solicitada: value,
                                });
                                calculateTotalFromItems(items);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-sm">
                          <ComprasFormSelect 
                          id="unidad_medida_compra" 
                          value={watch(`detalles.${item.id}.unidad_medida_compra`)?.toString() || ""} 
                          onChange={(v: string) => setValue(`detalles.${item.id}.unidad_medida_compra`, Number(v))}>
                            {unidadesMedida?.map((unidad) => (
                              <SelectItem key={unidad.id} value={unidad.id.toString()}>{unidad.abreviatura}</SelectItem>
                            ))}
                          </ComprasFormSelect>
                          </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(item.costo_unitario_usd)}
                        </TableCell>
                        <TableCell className="text-sm">
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.1" 
                            className="focus-visible:ring-blue-200"   
                            defaultValue={item.porcentaje_impuesto} 
                            onChange={(e) => {
                              const productoId = item.id;
                              const value = Number(e.target.value);

                              const calculations = updateItemCalculations(item, value);
                              const productoIndex = findProductoIndex(watch, productoId);
                              
                              updateFormDetalles(items, productoIndex, calculations, {
                                porcentaje_impuesto: value,
                              });
                              calculateTotalFromItems(items);
                            }} 
                          />
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
                            onClick={() => removeItem(item.id)}
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
            <ComprasFormTotals
              bcvRate={bcvRate?.promedio}
              totalVes={Number(watch("monto_total_oc_ves")) || 0}
              subtotalUsd={Number(subtotal) || 0}
              addedCostsUsd={Number(watch("monto_impuestos_oc_usd")) || 0}
              totalUsd={Number(watch("monto_total_oc_usd")) || 0}
              formatCurrency={formatCurrency}
            />

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

