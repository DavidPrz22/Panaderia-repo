import { useEffect, useState } from "react";

import type { Orden, OrderLineItem } from "../types/types";

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

import { OrdenesFormSelect } from "./OrdenesFormSelect";
import { OrdenesProductoFormSearch } from "./OrdenesProductoFormSearch";
import { useGetParametros, useGetEstadosOrden, useGetBCVRate } from "../hooks/queries/queries";

import { useForm } from "react-hook-form";
import { orderSchema, type TOrderSchema } from "../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrdenesFormDatePicker } from "./OrdenesFormDatePicker";
import { toast } from "sonner";

interface OrderFormProps {
  order?: Orden;
  onClose: () => void;
  onSave: (order: Orden) => void;
}

export const OrderForm = ({ order, onClose, onSave }: OrderFormProps) => {

  const {
    handleSubmit,
    watch,
    setValue,
  } = useForm<TOrderSchema>({
    resolver: zodResolver(orderSchema),
    defaultValues:
      order
        ? {
            cliente_id: order.cliente_id,
            fecha_creacion_orden: order.fecha_creacion_orden,
            fecha_entrega_solicitada: order.fecha_entrega_solicitada,
            fecha_entrega_definitiva: order.fecha_entrega_definitiva,
            estado_orden: order.estado_orden,
            metodo_pago_id: order.metodo_pago_id,
            productos: order.productos.map(p => ({
              producto: { id: Number(p.producto.id), tipo_producto: p.producto.tipo },
              cantidad_solicitada: p.cantidad_solicitada,
              unidad_medida_id: 0,
              precio_unitario_usd: p.precio_unitario_usd,
              subtotal_linea_usd: p.subtotal,
              descuento_porcentaje: p.descuento_porcentaje,
              impuesto_porcentaje: p.impuesto_porcentaje,
            })),
            notas_generales: order.notas_generales,
            monto_descuento_usd: order.monto_descuento_usd,
            monto_total_usd: order.monto_total_usd,
            monto_total_ves: order.monto_total_ves,
            tasa_cambio_aplicada: order.tasa_cambio_aplicada,
          }
        : {
            fecha_creacion_orden: new Date().toISOString().split('T')[0],
            fecha_entrega_solicitada: new Date().toISOString().split('T')[0],
            fecha_entrega_definitiva: undefined,
            productos: [],
            notas_generales: "",
            monto_descuento_usd: 0,
            monto_total_usd: 0,
            monto_total_ves: 0,
            tasa_cambio_aplicada: 0,
          },
  });

  const isEdit = !!order;

  const [{ data: clientes }, { data: metodosDePago }] = useGetParametros();
  const { data: estadosOrden } = useGetEstadosOrden();
  const { data: bcvRate } = useGetBCVRate();

  const [items, setItems] = useState<OrderLineItem[]>(order?.productos || []);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (bcvRate) {
      setValue('tasa_cambio_aplicada', Number(bcvRate.promedio))
    }
  }, [bcvRate, setValue])

  const addItem = () => {
    const newItem: OrderLineItem = {
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

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const calculateSubtotal = (item: OrderLineItem) => {
    return item.precio_unitario_usd * item.cantidad_solicitada * (1 - item.descuento_porcentaje / 100) * (1 + item.impuesto_porcentaje / 100)
  }

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>, item: OrderLineItem, fieldSchema: keyof TOrderSchema['productos'][number], field: 'descuento_porcentaje' | 'impuesto_porcentaje') =>{
    const productoId = item.producto.id!
    const productoIndex = watch("productos")?.findIndex((p) => p.producto.id === productoId)
    if (productoIndex !== -1) {
      setValue(`productos.${productoIndex}.${fieldSchema}`, Number(e.target.value), { shouldValidate: true })
      item[field] = Number(e.target.value)
      const subtotal = calculateSubtotal(item)
      item.subtotal = subtotal
    }
    calculateTotal();
  }
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!customerId) {
  //     toast.error("Por favor selecciona un cliente");
  //     return;
  //   }

  //   if (items.length === 0) {
  //     toast.error("Agrega al menos un producto");
  //     return;
  //   }

  //   const hasInvalidItems = items.some((item) => !item.productId || item.quantity <= 0);
  //   if (hasInvalidItems) {
  //     toast.error("Verifica que todos los productos tengan cantidad válida");
  //     return;
  //   }

  //   const customer = mockCustomers.find((c) => c.id === customerId)!;
  //   const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

  //   const newOrder: Order = {
  //     id: order?.id || `order-${Date.now()}`,
  //     orderNumber: order?.orderNumber || `S${String(Date.now()).slice(-5)}`,
  //     customerId,
  //     customer,
  //     orderDate: orderDate.toISOString(),
  //     requestedDeliveryDate: requestedDeliveryDate?.toISOString(),
  //     confirmedDeliveryDate: confirmedDeliveryDate?.toISOString(),
  //     status,
  //     paymentMethod,
  //     items,
  //     subtotal,
  //     taxAmount,
  //     discountAmount,
  //     total,
  //     notes,
  //     createdBy: "admin",
  //     createdAt: order?.createdAt || new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   };

  //   onSave(newOrder);
  //   toast.success(isEdit ? "Orden actualizada" : "Orden creada exitosamente");
  //   onClose();
  // };

  const calculateTotal = () => {
    // Calculate subtotal (before discounts and taxes)
    const subtotalBeforeFees = items.reduce((sum, item) => sum + (item.precio_unitario_usd * item.cantidad_solicitada), 0)
    
    // Calculate total discount amount
    const CantidadDescuento = items.reduce((sum, item) => {
      const lineSubtotal = item.precio_unitario_usd * item.cantidad_solicitada;
      return sum + (item.descuento_porcentaje * lineSubtotal / 100);
    }, 0)
    
    // Calculate total tax amount
    const CantidadImpuesto = items.reduce((sum, item) => {
      const lineSubtotal = item.precio_unitario_usd * item.cantidad_solicitada;
      return sum + (item.impuesto_porcentaje * lineSubtotal / 100);
    }, 0)

    setSubtotal(subtotalBeforeFees)
    setValue('monto_impuestos_usd', CantidadImpuesto)
    setValue('monto_descuento_usd', CantidadDescuento)
    setValue('monto_total_usd', subtotalBeforeFees - CantidadDescuento + CantidadImpuesto)
    setValue('monto_total_ves', (subtotalBeforeFees - CantidadDescuento + CantidadImpuesto) * watch('tasa_cambio_aplicada'))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="p-6">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-card">
          <CardTitle className="text-2xl font-bold">
            {isEdit ? "Editar Orden" : "Nueva Orden"}
          </CardTitle>
          <Button className="cursor-pointer" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4 " />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit() }>
          <CardContent className="space-y-6 pt-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <OrdenesFormSelect id="cliente" value={watch("cliente_id") ? watch("cliente_id").toString() : ""} onChange={(v) => {
                  setValue("cliente_id", Number(v))
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
                <OrdenesFormSelect id="payment" value={watch("metodo_pago_id") ? watch("metodo_pago_id").toString() : ""} onChange={(v) => setValue("metodo_pago_id", Number(v))} placeholder="Selecciona un método de pago">
                    {metodosDePago?.map((metodo) => (
                      <SelectItem key={metodo.id} value={metodo.id.toString()}>{metodo.nombre_metodo}</SelectItem>
                    ))}
                </OrdenesFormSelect>
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
                      <TableRow key={item.id}>
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

                              console.log(producto)
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
                                  unidad_medida_id: item.unidad_medida_venta.id,
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
                            className="p-1.5"
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
                            className="p-1.5"
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
                    <span className="font-medium">{bcvRate?.promedio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total en VES: </span>
                    <span className="font-medium">{watch("monto_total_ves").toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 w-80">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Descuentos:</span>
                    <span className="font-medium text-destructive">
                      -{formatCurrency(watch("monto_descuento_usd"))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impuestos:</span>
                    <span className="font-medium">{formatCurrency(watch("monto_impuestos_usd"))}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(watch("monto_total_usd"))}</span>
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

