export type OrdenesEstado = 
  | "Pendiente" 
  | "Confirmado" 
  | "En Preparación" 
  | "Listo para Entrega" 
  | "Entregado" 
  | "Cancelado";

export type PaymentMethod = "Efectivo" | "Tarjeta" | "Transferencia" | "Crédito";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  unit: string;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  quantityDelivered: number;
  quantityInvoiced: number;
  unit: string;
  unitPrice: number;
  discount: number;
  tax: number;
  subtotal: number;
  stockAssigned: number;
  forProduction: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: Customer;
  orderDate: string;
  requestedDeliveryDate?: string;
  confirmedDeliveryDate?: string;
  status: OrdenesEstado;
  paymentMethod: PaymentMethod;
  items: OrderLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
