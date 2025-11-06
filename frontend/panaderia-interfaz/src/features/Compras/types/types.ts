export type Proveedor = {
  id: number;
  nombre_proveedor: string;
  nombre_comercial?: string;
  email_contacto?: string;
  telefono_contacto?: string;
};

export type EstadosOC =
  | "Borrador"
  | "Enviada"
  | "Recibida Parcial"
  | "Recibida Completa"
  | "Recibida Sin Pagar"
  | "Cancelada";

export type ProveedorRegistro = {
  id: number;
  nombre_proveedor: string;
};

export type EstadoOC = {
  id: number;
  nombre_estado: string;
};

export type MetodoDePago = {
  id: number;
  nombre_metodo: string;
};

export type Producto = {
  id: number;
  SKU: string;
  nombre: string;
  precio_compra_usd: number;
  unidad_medida_compra: { id: number; abreviatura: string };
  tipo: "materia-prima" | "producto-reventa";
};

export type OrdenCompraTable = {
  id: number;
  proveedor: string;
  fecha_emision_oc: string;
  fecha_entrega_esperada: string;
  fecha_entrega_real?: string;
  estado_oc: string;
  metodo_pago: string;
  monto_total_oc_usd: number;
};

export type PagoProveedor = {
  id: number;
  proveedor: Proveedor;
  compra_asociada?: number;
  orden_compra_asociada?: number;
  fecha_pago: string;
  metodo_pago: MetodoDePago;
  monto_pago_usd: number;
  monto_pago_ves: number;
  referencia_pago?: string;
};

export type DetalleOC = {
  id: number;
  materia_prima?: number;
  materia_prima_nombre?: string;
  producto_reventa?: number;
  producto_reventa_nombre?: string;
  cantidad_solicitada: number;
  cantidad_recibida?: number;
  unidad_medida_compra?: number;
  unidad_medida_abrev?: string;
  costo_unitario_usd: number;
  subtotal_linea_usd: number;
};

export type OrdenCompra = {
  id: number;
  proveedor: Proveedor;
  usuario_creador: number;
  fecha_emision_oc: string;
  fecha_entrega_esperada: string;
  fecha_entrega_real?: string;
  estado_oc: EstadoOC;
  monto_total_oc_usd: number;
  monto_total_oc_ves: number;
  metodo_pago: { id: number; nombre_metodo: string };
  tasa_cambio_aplicada: number;
  direccion_envio?: string;
  notas?: string;
  detalles: DetalleOC[];
  email_enviado: boolean;
  fecha_email_enviado?: string;
  terminos_pago?: string;
};

export type LoteRecepcion = {
  id: number;
  cantidad: number;
  fecha_caducidad: string;
};

export type ComponentesUIRecepcion = {
  linea_oc: DetalleOC;
  lotes: LoteRecepcion[];
  cantidad_total_recibida: number;
};

export type DetalleRecepcion = {
  detalle_oc_id: number;
  lotes: LoteRecepcion[];
};

export type RecepcionForm = {
  orden_compra_id: number;
  detalles: DetalleRecepcion[];
};
