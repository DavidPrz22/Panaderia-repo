import { useState } from "react";

import type { Orden, OrderLineItem, Estados, MetodoPago } from "../types/types";
import { mockCustomers, mockProducts } from "../data/mockData";

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
import { useGetParametros, useGetEstadosOrden } from "../hooks/queries";

import { useForm } from "react-hook-form";
import { orderSchema, type TOrderSchema } from "../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrdenesFormDatePicker } from "./OrdenesFormDatePicker";

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
  

  const [items, setItems] = useState<OrderLineItem[]>(order?.productos || []);
  console.log(watch())
  const addItem = () => {
    const newItem: OrderLineItem = {
      id: items.length + 1,
      producto: mockProducts[0],
      cantidad_solicitada: 1,
      unidad_medida_venta: "Units",
      precio_unitario_usd: 0,
      descuento_porcentaje: 0,
      impuesto_porcentaje: 15,
      subtotal: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderLineItem, value: any) => {
    const newItems = [...items];
    const item = newItems[index];

    if (field === "productId") {
      const product = mockProducts.find((p) => p.name === value);
      if (product) {
        item.product = product;
        item.productId = product.id;
        item.unitPrice = product.price;
        item.unit = product.unit;
        
        // Calcular asignación de stock y producción
        const stockAvailable = product.stock;
        item.stockAssigned = Math.min(item.quantity, stockAvailable);
        item.forProduction = Math.max(0, item.quantity - stockAvailable);
      }
    } else {
      (item as any)[field] = value;
    }

    // Recalcular subtotal
    const baseAmount = item.quantity * item.unitPrice;
    const discountAmount = (baseAmount * item.discount) / 100;
    const afterDiscount = baseAmount - discountAmount;
    item.subtotal = afterDiscount;

    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice * item.discount) / 100,
      0
    );
    const taxAmount = items.reduce(
      (sum, item) => sum + (item.subtotal * item.tax) / 100,
      0
    );
    const total = subtotal + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totals = calculateTotals();
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

        <form onSubmit={handleSubmit(onSave) }>
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
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <OrdenesProductoFormSearch value={item.productId} onChange={(value) => updateItem(index, "productId", value)} data={mockProducts} />
                        </TableCell>
                        <TableCell className="text-center text-sm text-success">
                          {item.stockAssigned}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, "quantity", parseFloat(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-sm">{item.unit}</TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discount}
                            onChange={(e) =>
                              updateItem(index, "discount", parseFloat(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={item.tax}
                            onChange={(e) =>
                              updateItem(index, "tax", parseFloat(e.target.value) || 0)
                            }
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
                            onClick={() => removeItem(index)}
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
              <div className="space-y-2 w-80">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Descuentos:</span>
                  <span className="font-medium text-destructive">
                    -{formatCurrency(totals.discountAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impuestos:</span>
                  <span className="font-medium">{formatCurrency(totals.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(totals.total)}</span>
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

