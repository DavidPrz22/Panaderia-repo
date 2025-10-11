import { useState } from "react";

import type { Order, OrderLineItem, OrdenesEstado, PaymentMethod } from "../types/types";
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

import { X, Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { toast } from "sonner";


import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { OrdenesFormSelect } from "./OrdenesFormSelect";
import { OrdenesProductoFormSearch } from "./OrdenesProductoFormSearch";
import { useGetParametros, useGetEstadosOrden } from "../hooks/queries";

interface OrderFormProps {
  order?: Order;
  onClose: () => void;
  onSave: (order: Order) => void;
}

export const OrderForm = ({ order, onClose, onSave }: OrderFormProps) => {
  const isEdit = !!order;

  const [{ data: clientes }, { data: metodosDePago }] = useGetParametros();
  const { data: estadosOrden } = useGetEstadosOrden();

  const [customerId, setCustomerId] = useState(order?.customerId || "");
  const [orderDate, setOrderDate] = useState<Date>(
    order ? new Date(order.orderDate) : new Date()
  );
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState<Date | undefined>(
    order?.requestedDeliveryDate ? new Date(order.requestedDeliveryDate) : undefined
  );
  const [confirmedDeliveryDate, setConfirmedDeliveryDate] = useState<Date | undefined>(
    order?.confirmedDeliveryDate ? new Date(order.confirmedDeliveryDate) : undefined
  );
  const [status, setStatus] = useState<OrdenesEstado>(order?.status || "Pendiente");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    order?.paymentMethod || "Efectivo"
  );
  const [notes, setNotes] = useState(order?.notes || "");
  const [items, setItems] = useState<OrderLineItem[]>(order?.items || []);

  const addItem = () => {
    const newItem: OrderLineItem = {
      id: `temp-${Date.now()}`,
      productId: "",
      product: mockProducts[0],
      quantity: 1,
      quantityDelivered: 0,
      quantityInvoiced: 0,
      unit: "Units",
      unitPrice: 0,
      discount: 0,
      tax: 15,
      subtotal: 0,
      stockAssigned: 0,
      forProduction: 0,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      toast.error("Por favor selecciona un cliente");
      return;
    }

    if (items.length === 0) {
      toast.error("Agrega al menos un producto");
      return;
    }

    const hasInvalidItems = items.some((item) => !item.productId || item.quantity <= 0);
    if (hasInvalidItems) {
      toast.error("Verifica que todos los productos tengan cantidad válida");
      return;
    }

    const customer = mockCustomers.find((c) => c.id === customerId)!;
    const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

    const newOrder: Order = {
      id: order?.id || `order-${Date.now()}`,
      orderNumber: order?.orderNumber || `S${String(Date.now()).slice(-5)}`,
      customerId,
      customer,
      orderDate: orderDate.toISOString(),
      requestedDeliveryDate: requestedDeliveryDate?.toISOString(),
      confirmedDeliveryDate: confirmedDeliveryDate?.toISOString(),
      status,
      paymentMethod,
      items,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      notes,
      createdBy: "admin",
      createdAt: order?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newOrder);
    toast.success(isEdit ? "Orden actualizada" : "Orden creada exitosamente");
    onClose();
  };

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

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Cliente *</Label>
                <OrdenesFormSelect id="customer" value={customerId} onChange={(v) => setCustomerId(v)} placeholder="Selecciona un cliente">
                    {clientes?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.nombre_cliente}
                      </SelectItem>
                    ))}
                  </OrdenesFormSelect>
                
              </div>

              <div className="space-y-2">
                <Label>Fecha de Orden *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal cursor-pointer",
                        !orderDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(orderDate, "PPP", { locale: es })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-(--z-index-over-header-bar)" align="start">
                    <Calendar
                      mode="single"
                      selected={orderDate}
                      onSelect={(date) => date && setOrderDate(date)}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Entrega Solicitada*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal cursor-pointer",
                        !requestedDeliveryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {requestedDeliveryDate
                        ? format(requestedDeliveryDate, "PPP", { locale: es })
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-(--z-index-over-header-bar)" align="start">
                    <Calendar
                      mode="single"
                      selected={requestedDeliveryDate}
                      onSelect={setRequestedDeliveryDate}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Entrega Definitiva</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal cursor-pointer",
                        !confirmedDeliveryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {confirmedDeliveryDate
                        ? format(confirmedDeliveryDate, "PPP", { locale: es })
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-(--z-index-over-header-bar)" align="start">
                    <Calendar
                      mode="single"
                      selected={confirmedDeliveryDate}
                      onSelect={setConfirmedDeliveryDate}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <OrdenesFormSelect id="status" value={status} onChange={(v) => setStatus(v as OrdenesEstado)}>
                    {estadosOrden?.map((estado) => (
                      <SelectItem key={estado.id} value={estado.id}>{estado.nombre_estado}</SelectItem>
                    ))}
                </OrdenesFormSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Método de Pago *</Label>
                <OrdenesFormSelect id="payment" value={paymentMethod} onChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    {metodosDePago?.map((metodo) => (
                      <SelectItem key={metodo.id} value={metodo.id}>{metodo.nombre_metodo}</SelectItem>
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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

