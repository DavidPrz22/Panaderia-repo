export type Cliente = {
  id: number;
  nombre_cliente: string;
}

export type MetodoPago = {
  id: number;
  nombre_metodo: string;
}

export type EstadoOrden = {
  id: number;
  nombre_estado: string;
}

export type Estados = 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';

export type Producto = {
  id: number;
  SKU: string;
  nombre_producto: string;
  precio_venta_usd: number;
  stock_actual: number;
  unidad_venta: string;
  tipo: 'producto-final' | 'producto-reventa';
}

type productoOrden = {
  id: number | null;
  SKU: string;
  stock?: number;
  nombre_producto: string;
  tipo_producto: 'producto-final' | 'producto-reventa' | null;
}

export interface OrderLineItem {
  producto: productoOrden;
  cantidad_solicitada: number;
  unidad_medida: { id: number; abreviatura: string; nombre_completo?: string };
  precio_unitario_usd: number;
  descuento_porcentaje: number;
  impuesto_porcentaje: number;
  subtotal_linea_usd: number;
}

// Form-specific type with additional fields for local state management
export interface OrderLineItemForm {
  id: number;
  producto: productoOrden;
  stock: number;
  cantidad_solicitada: number;
  unidad_medida_venta: { id: number; abreviatura: string; nombre_completo?: string };
  precio_unitario_usd: number;
  descuento_porcentaje: number;
  impuesto_porcentaje: number;
  subtotal: number;
}

export type ClienteDetalles = {
  id: number;
  nombre_cliente: string;
  telefono: string;
  email: string;
  rif_cedula: string;
}

export interface Orden {
  id: number;
  cliente: ClienteDetalles;
  fecha_creacion_orden: string;
  fecha_entrega_solicitada: string;
  fecha_entrega_definitiva?: string;
  estado_orden: EstadoOrden;
  metodo_pago: MetodoPago;
  productos: OrderLineItem[];
  subtotal_usd: number;
  monto_impuestos_usd: number;
  monto_descuento_usd: number;
  monto_total_usd: number;
  monto_total_ves: number;
  tasa_cambio_aplicada: number;
  notas_generales?: string;
  created_at: string;
  updated_at: string;
  referencia_pago?: string;
}


export type OrdenTable = {
  id: number;
  cliente: string;
  fecha_creacion_orden: string;
  fecha_entrega_solicitada: string;
  fecha_entrega_definitiva: string;
  estado_orden: string;
  metodo_pago: string;
  total: number;
}

export type OrdenProductoSearch = {
  id: number;
  SKU: string;
  unidad_venta: {
    id: number;
    abreviatura: string;
  };
  nombre_producto: string;
  precio_venta_usd: number;
  stock_actual: number;
  tipo: 'producto-final' | 'producto-reventa';
}

export type OrdenProductosSearch = {
  productos: OrdenProductoSearch[];
}