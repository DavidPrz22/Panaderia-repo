export type Cliente = {
  id: string;
  nombre_cliente: string;
}

export type MetodoPago = {
  id: string;
  nombre_metodo: string;
}

export type EstadoOrden = {
  id: string;
  nombre_estado: string;
}

export type Producto = {
  id: string;
  SKU: string;
  nombre_producto: string;
  precio_venta_usd: number;
  stock_actual: number;
  unidad_venta: string;
  tipo: 'producto-final' | 'producto-reventa';
}

export interface OrderLineItem {
  id: string;
  producto: Producto;
  stock: number;
  cantidad_solicitada: number;
  unidad_medida_venta: string;
  precio_unitario_usd: number;
  descuento_porcentaje: number;
  impuesto_porcentaje: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  cliente_id: string;
  fecha_creacion_orden: string;
  fecha_entrega_solicitada?: string;
  fecha_entrega_definitiva?: string;
  status: string;
  paymentMethod: string;
  items: OrderLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
