import type { UseFormWatch, UseFormSetValue } from "react-hook-form";



export type Cliente = {
  id: number;
  nombre_cliente: string;
};

export type Carrito = {
    id: number;
    cliente_id: number;
    fecha: string;
    total: number;
    estado: string;
    items: CarritoItem[];
};

export type CarritoItem = {
    id: number; // producto id
    tipo: 'final' | 'reventa';
    nombre?: string;
    cantidad: number;
    precio: number;
    subtotal: number;
};

export type Producto = {
  id: number;
  nombre: string;
  unidadVenta: string;
  categoria: string;
  sku: string;
  tipo: "final" | "reventa";
  precio: number;
  stock: number;
}

export type TipoProducto = "final" | "reventa" | 'todos';

export type Categorias = {
  [tipo in TipoProducto]: string[]
}

export type WatchSetValue = {
  watch?: UseFormWatch<any>;
  setValue?: UseFormSetValue<any>;
}