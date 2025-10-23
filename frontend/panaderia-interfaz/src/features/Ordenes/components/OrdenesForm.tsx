import { useEffect, useState } from "react";

import type { Orden, OrderLineItemForm } from "../types/types";

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
import { OrdenesFormSelect } from "./OrdenesFormSelect";
import { OrdenesProductoFormSearch } from "./OrdenesProductoFormSearch";
import { useGetParametros, useGetEstadosOrdenRegistro, useGetBCVRate } from "../hooks/queries/queries";

import { useForm } from "react-hook-form";
import { orderSchema, type TOrderSchema } from "../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrdenesFormDatePicker } from "./OrdenesFormDatePicker";
import { toast } from "sonner";

import { useCreateOrdenMutation, useUpdateOrdenMutation } from "../hooks/mutations/mutations";

interface OrderFormProps {
  order?: Orden;
  onClose: () => void;
}

export const OrderForm = ({ order, onClose }: OrderFormProps) => {

  const {
    handleSubmit,
    watch,
    setValue,
  } = useForm<TOrderSchema>({
    resolver: zodResolver(orderSchema),
    defaultValues:
      order
        ? {
            cliente: order.cliente.id,
            fecha_creacion_orden: order.fecha_creacion_orden,
            fecha_entrega_solicitada: order.fecha_entrega_solicitada,
            fecha_entrega_definitiva: order.fecha_entrega_definitiva,
            estado_orden: order.estado_orden.id,
            metodo_pago: order.metodo_pago.id,
            productos: order.productos.map(p => ({
              producto: { id: Number(p.producto.id), tipo_producto: p.producto.tipo_producto!},
              cantidad_solicitada: p.cantidad_solicitada,
              unidad_medida: p.unidad_medida.id,
              precio_unitario_usd: p.precio_unitario_usd,
              subtotal_linea_usd: p.subtotal_linea_usd,
              descuento_porcentaje: p.descuento_porcentaje,
              impuesto_porcentaje: p.impuesto_porcentaje,
            })),
            notas_generales: order.notas_generales,
            monto_descuento_usd: order.monto_descuento_usd,
            monto_impuestos_usd: order.monto_impuestos_usd,
            monto_total_usd: order.monto_total_usd,
            monto_total_ves: order.monto_total_ves,
            tasa_cambio_aplicada: order.tasa_cambio_aplicada,
            referencia_pago: order.referencia_pago ?? undefined,
          }
        : {
            fecha_creacion_orden: format(new Date(), "yyyy-MM-dd"),
            fecha_entrega_solicitada: format(new Date(), "yyyy-MM-dd"),
            fecha_entrega_definitiva: undefined,
            productos: [],
            notas_generales: "",
            monto_descuento_usd: 0,
            monto_impuestos_usd: 0,
            monto_total_usd: 0,
            monto_total_ves: 0,
            tasa_cambio_aplicada: 0,
            referencia_pago: "",
          },
  });

  const isEdit = !!order;
  const [{ data: clientes }, { data: metodosDePago }] = useGetParametros();
  const { data: estadosOrden } = useGetEstadosOrdenRegistro();
  const { data: bcvRate } = useGetBCVRate();
  console.log( watch())
  const { mutateAsync: createOrdenMutation, isPending: isCreatingOrden } = useCreateOrdenMutation();
  const { mutateAsync: updateOrdenMutation, isPending: isUpdatingOrden } = useUpdateOrdenMutation();

  const [items, setItems] = useState<OrderLineItemForm[]>(
    order?.productos.map((p, idx) => ({
      id: idx + 1,
      producto: p.producto,
      stock: p.producto.stock || 0, // Will need to fetch actual stock if editing
      cantidad_solicitada: p.cantidad_solicitada,
      unidad_medida_venta: p.unidad_medida,
      precio_unitario_usd: p.precio_unitario_usd,
      descuento_porcentaje: p.descuento_porcentaje,
      impuesto_porcentaje: p.impuesto_porcentaje,
      subtotal: p.subtotal_linea_usd,
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
  
  const calculateTotalFromItems = (itemsArray: OrderLineItemForm[]) => {
    const subtotalBeforeFees = itemsArray.reduce((sum, item) => sum + (item.precio_unitario_usd * item.cantidad_solicitada), 0);
    
    const CantidadDescuento = itemsArray.reduce((sum, item) => {
      const lineSubtotal = item.precio_unitario_usd * item.cantidad_solicitada;
      return sum + (item.descuento_porcentaje * lineSubtotal / 100);
    }, 0);

    const CantidadImpuesto = itemsArray.reduce((sum, item) => {
      const lineSubtotal = item.precio_unitario_usd * item.cantidad_solicitada;
      const lineSubtotalAfterDiscount = lineSubtotal * (1 - item.descuento_porcentaje / 100);
      return sum + (item.impuesto_porcentaje * lineSubtotalAfterDiscount / 100);
    }, 0);

    setSubtotal(subtotalBeforeFees);
    setValue('monto_impuestos_usd', roundTo3(CantidadImpuesto));
    setValue('monto_descuento_usd', roundTo3(CantidadDescuento));
    setValue('monto_total_usd', roundTo3(subtotalBeforeFees - CantidadDescuento + CantidadImpuesto));
    setValue('monto_total_ves', roundTo3((subtotalBeforeFees - CantidadDescuento + CantidadImpuesto) * (Number(watch('tasa_cambio_aplicada')) || 0)));
  };

  useEffect(() => {
    if (order) {
      calculateTotalFromItems(items)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addItem = () => {
    const newItem: OrderLineItemForm = {
      id: items.length + 1,
      producto: {
        id: null,
        SKU: "",
        nombre_producto: "",
        tipo_producto: null,
      },
      stock: 0,
      cantidad_solicitada: 0,
      unidad_medida_venta: { id: 0, abreviatura: "" },
      precio_unitario_usd: 0,
      descuento_porcentaje: 0,
      impuesto_porcentaje: 0,
      subtotal: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number, productoId: number) => {
    const newItems = items.filter((i) => i.id !== id);
    const newProductos = watch('productos')?.filter((p) => p.producto.id !== productoId) || [];
    
    setItems(newItems);
    setValue('productos', newProductos);
    
    if (newProductos.length === 0) {
      resetAmounts();
    } else {
      calculateTotalFromItems(newItems);
    }
  };

  const resetAmounts = () => {
    setSubtotal(0)
    setValue('monto_impuestos_usd', 0)
    setValue('monto_descuento_usd', 0)
    setValue('monto_total_usd', 0)
    setValue('monto_total_ves', 0)
  }
  const calculateSubtotal = (item: OrderLineItemForm) => {
    const subtotal = item.precio_unitario_usd * item.cantidad_solicitada * (1 - item.descuento_porcentaje / 100) * (1 + item.impuesto_porcentaje / 100)
    return roundTo3(subtotal)
  }

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>, item: OrderLineItemForm, fieldSchema: keyof TOrderSchema['productos'][number], field: 'descuento_porcentaje' | 'impuesto_porcentaje') =>{
    const productoId = item.producto.id!
    const productoIndex = watch("productos")?.findIndex((p) => p.producto.id === productoId)
    if (productoIndex !== -1) {
      setValue(`productos.${productoIndex}.${fieldSchema}`, Number(e.target.value), { shouldValidate: true })
      item[field] = Number(e.target.value)
      const subtotal = calculateSubtotal(item)
      setValue(`productos.${productoIndex}.subtotal_linea_usd`, subtotal)
      item.subtotal = subtotal
    }
    calculateTotal();
  }
  const handleSubmitForm = async (data: TOrderSchema) => {
    try {
      if (isEdit && order) {
    
        await updateOrdenMutation({ id: order.id, data });
        toast.success("Orden actualizada exitosamente");
      } else {
        await createOrdenMutation(data);
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
      {(isCreatingOrden || isUpdatingOrden) && (
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
                <OrdenesFormSelect id="cliente" value={watch("cliente") ? watch("cliente").toString() : ""} onChange={(v) => {
                  setValue("cliente", Number(v))
                  }} placeholder="Selecciona un cliente">
                    {clientes?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.nombre_cliente}
                      </SelectItem>
                    ))}
                  </OrdenesFormSelect>
                
              </div>

              {/* Fecha de Orden */}
              <OrdenesFormDatePicker 
                label="Fecha de Orden" 
                value={watch("fecha_creacion_orden")} 
                onChange={(v) => setValue("fecha_creacion_orden", v)} 
              />

              {/* Fecha de Entrega Solicitada */}
              <OrdenesFormDatePicker 
                label="Fecha de Entrega Solicitada" 
                value={watch("fecha_entrega_solicitada")} 
                onChange={(v) => setValue("fecha_entrega_solicitada", v)} 
              />

              {/* Fecha de Entrega Definitiva */}
              <OrdenesFormDatePicker 
                label="Fecha de Entrega Definitiva" 
                value={watch("fecha_entrega_definitiva")!} 
                onChange={(v) => setValue("fecha_entrega_definitiva", v)} 
                optional
              />

              {/* Estado de la Orden */}
              <div className="space-y-2">
                <Label htmlFor="estadoOrden">Estado *</Label>
                <OrdenesFormSelect id="estadoOrden" value={watch("estado_orden") ? watch("estado_orden").toString() : ""} placeholder="Selecciona un estado" onChange={(v) => setValue("estado_orden", Number(v))}>
                    {estadosOrden?.map((estado) => (
                      <SelectItem key={estado.id} value={estado.id.toString()}>{estado.nombre_estado}</SelectItem>
                    ))}
                </OrdenesFormSelect>
              </div>

              {/* Método de Pago */}
              <div className="space-y-2">
                <Label htmlFor="payment">Método de Pago *</Label>
                <OrdenesFormSelect id="payment" value={watch("metodo_pago") ? watch("metodo_pago").toString() : ""} onChange={(v) => setValue("metodo_pago", Number(v))} placeholder="Selecciona un método de pago">
                    {metodosDePago?.map((metodo) => (
                      <SelectItem key={metodo.id} value={metodo.id.toString()}>{metodo.nombre_metodo}</SelectItem>
                    ))}
                </OrdenesFormSelect>
              </div>
              {/* Referencia de Pago */}
              <div className="space-y-2">
                <Label htmlFor="payment">Referencia de Pago (Opcional)</Label>
                <Input
                  id="payment"
                  type="text"
                  value={watch("referencia_pago") ?? ""}
                  className="focus-visible:ring-blue-200"
                  onChange={(e) => setValue("referencia_pago", e.target.value || undefined)}
                  placeholder="Referencia de Pago"
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
                      <TableHead className="font-semibold w-24">Stock </TableHead>
                      <TableHead className="font-semibold w-24">Cantidad *</TableHead>
                      <TableHead className="font-semibold w-20">UdM</TableHead>
                      <TableHead className="font-semibold w-28">Precio UdM</TableHead>
                      <TableHead className="font-semibold w-20">Desc%</TableHead>
                      <TableHead className="font-semibold w-20">Imp%</TableHead>
                      <TableHead className="font-semibold w-28">Subtotal</TableHead>
                      <TableHead className="font-semibold w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id + item.producto.id!}>
                        <TableCell>
                          <OrdenesProductoFormSearch value={item.producto.id ? item.producto.nombre_producto : ""} onChange={
                            (producto) => {

                              if (producto.stock_actual <= 0) {
                                toast.error("El Producto No Tiene Stock")
                                return
                              }

                              if (watch("productos")?.findIndex((p) => p.producto.id === producto.id) !== -1) {
                                toast.error("El Producto Ya Existe en la Orden")
                                return
                              }

                              item.precio_unitario_usd = producto.precio_venta_usd
                              item.unidad_medida_venta = producto.unidad_venta
                              item.stock = producto.stock_actual
                              item.producto.id = producto.id
                              item.producto.tipo_producto = producto.tipo
                              item.producto.nombre_producto = producto.nombre_producto

                              setItems([...items])
                              const schemaValue: TOrderSchema['productos'] = items.map((item)=>{
                                return {
                                  producto: { id: item.producto.id!, tipo_producto: item.producto.tipo_producto! },
                                  cantidad_solicitada: item.cantidad_solicitada,
                                  unidad_medida: item.unidad_medida_venta.id,
                                  precio_unitario_usd: item.precio_unitario_usd,
                                  subtotal_linea_usd: item.subtotal,
                                  descuento_porcentaje: item.descuento_porcentaje,
                                  impuesto_porcentaje: item.impuesto_porcentaje,
                                }
                              })
                              setValue('productos', schemaValue )
                            }
                            } />
                        </TableCell>
                        <TableCell className="text-center text-sm text-success">
                          {item.stock}
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

                                const productoId = item.producto.id!
                                
                                if (Number(e.target.value) > item.stock) {
                                  e.target.value = item.stock.toString()
                                  toast.error("La Cantidad No Puede Ser Mayor al Stock")
                                  return
                                }
                                if (Number(e.target.value) < 0) {
                                  e.target.value = "0"
                                  toast.error("La Cantidad No Puede Ser Menor a 0")
                                  return
                                }

                                const productoIndex = watch("productos")?.findIndex((p) => p.producto.id === productoId)
                                if (productoIndex !== -1) {
                                  setValue(`productos.${productoIndex}.cantidad_solicitada`, Number(e.target.value), { shouldValidate: true })
                                  item.cantidad_solicitada = Number(e.target.value)
                                  const subtotal = calculateSubtotal(item)
                                  item.subtotal = subtotal
                                }
                                calculateTotal();
                              }}
                          />
                        </TableCell>
                        <TableCell className="text-sm">{item.unidad_medida_venta.abreviatura}</TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(item.precio_unitario_usd)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="p-1.5 focus-visible:ring-blue-200"
                            defaultValue={item.descuento_porcentaje}
                            onChange={(e) => handleUpdate(e, item, 'descuento_porcentaje', 'descuento_porcentaje')}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="p-1.5 focus-visible:ring-blue-200"
                            defaultValue={item.impuesto_porcentaje}
                            onChange={(e) => handleUpdate(e, item, 'impuesto_porcentaje', 'impuesto_porcentaje')}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            className="cursor-pointer"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id, item.producto.id!)}
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
                value={watch("notas_generales")}
                onChange={(e) => setValue("notas_generales", e.target.value)}
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
                    <span className="font-medium">{(Number(watch("monto_total_ves")) || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 w-80">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(Number(subtotal) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Descuentos:</span>
                    <span className="font-medium text-destructive">
                      -{formatCurrency(Number(watch("monto_descuento_usd")) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impuestos:</span>
                    <span className="font-medium">{formatCurrency(Number(watch("monto_impuestos_usd")) || 0)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(Number(watch("monto_total_usd")) || 0)}</span>
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

