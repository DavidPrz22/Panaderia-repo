# Frontend UI - Sistema de Órdenes de Compra

## 📋 Estructura de Carpetas

```
frontend/panaderia-interfaz/src/features/Compras/
├── api/
│   └── comprasApi.ts
├── components/
│   ├── ComprasIndex.tsx
│   ├── ComprasTable.tsx
│   ├── OrdenCompraForm.tsx
│   ├── OrdenCompraDetalles.tsx
│   ├── RecepcionForm.tsx
│   ├── PagoProveedorForm.tsx
│   ├── EstadoBadge.tsx
│   └── EmailDialog.tsx
├── hooks/
│   ├── queries/
│   │   └── comprasQueries.ts
│   └── mutations/
│       └── comprasMutations.ts
├── schema/
│   └── comprasSchema.ts
└── types/
    └── types.ts
```

---

## 📝 Types y Schemas

### types.ts

```typescript
// frontend/panaderia-interfaz/src/features/Compras/types/types.ts

export type Proveedor = {
  id: number;
  nombre_proveedor: string;
  nombre_comercial?: string;
  email_contacto?: string;
  telefono_contacto?: string;
};

export type EstadoOC = {
  id: number;
  nombre_estado: string;
};

export type DetalleOC = {
  id?: number;
  materia_prima?: number;
  materia_prima_nombre?: string;
  producto_reventa?: number;
  producto_reventa_nombre?: string;
  cantidad_solicitada: number;
  cantidad_recibida: number;
  unidad_medida_compra: number;
  unidad_medida_abrev?: string;
  costo_unitario_usd: number;
  subtotal_linea_usd: number;
  notas?: string;
};

export type OrdenCompra = {
  id: number;
  proveedor: Proveedor;
  usuario_creador: number;
  fecha_emision_oc: string;
  fecha_entrega_esperada: string;
  fecha_entrega_real?: string;
  estado_oc: EstadoOC;
  subtotal_oc_usd: number;
  monto_impuestos_oc_usd: number;
  monto_total_oc_usd: number;
  metodo_pago: { id: number; nombre_metodo: string };
  tasa_cambio_aplicada: number;
  direccion_envio?: string;
  notas?: string;
  detalles: DetalleOC[];
  email_enviado: boolean;
  fecha_email_enviado?: string;
};

export type LoteRecepcion = {
  cantidad: number;
  fecha_caducidad: string;
  costo_unitario_usd: number;
};

export type DetalleRecepcion = {
  detalle_oc_id: number;
  cantidad_recibida: number;
  lotes: LoteRecepcion[];
};

export type RecepcionForm = {
  orden_compra_id: number;
  fecha_recepcion: string;
  numero_factura_proveedor?: string;
  numero_remision?: string;
  notas?: string;
  detalles: DetalleRecepcion[];
};

export type PagoProveedor = {
  id: number;
  proveedor: Proveedor;
  compra_asociada?: number;
  orden_compra_asociada?: number;
  fecha_pago: string;
  metodo_pago: { id: number; nombre_metodo: string };
  monto_pago_usd: number;
  monto_pago_ves: number;
  referencia_pago?: string;
};
```

### comprasSchema.ts

```typescript
// frontend/panaderia-interfaz/src/features/Compras/schema/comprasSchema.ts

import { z } from "zod";

export const detalleOCSchema = z.object({
  materia_prima: z.number().optional(),
  producto_reventa: z.number().optional(),
  cantidad_solicitada: z.number().positive(),
  unidad_medida_compra: z.number(),
  costo_unitario_usd: z.number().positive(),
  notas: z.string().optional(),
});

export const ordenCompraSchema = z.object({
  proveedor: z.number(),
  fecha_emision_oc: z.string(),
  fecha_entrega_esperada: z.string(),
  estado_oc: z.number(),
  metodo_pago: z.number(),
  direccion_envio: z.string().optional(),
  notas: z.string().optional(),
  detalles: z.array(detalleOCSchema).min(1, "Debe agregar al menos un producto"),
});

export const loteRecepcionSchema = z.object({
  cantidad: z.number().positive(),
  fecha_caducidad: z.string(),
  costo_unitario_usd: z.number().positive(),
});

export const recepcionSchema = z.object({
  fecha_recepcion: z.string(),
  numero_factura_proveedor: z.string().optional(),
  numero_remision: z.string().optional(),
  notas: z.string().optional(),
  detalles: z.array(z.object({
    detalle_oc_id: z.number(),
    cantidad_recibida: z.number().positive(),
    lotes: z.array(loteRecepcionSchema).min(1),
  })),
});

export type TOrdenCompraSchema = z.infer<typeof ordenCompraSchema>;
export type TRecepcionSchema = z.infer<typeof recepcionSchema>;
```

---

## 🔌 API y Queries

### comprasApi.ts

```typescript
// frontend/panaderia-interfaz/src/features/Compras/api/comprasApi.ts

import api from "@/services/api";

export const comprasApi = {
  // Órdenes de Compra
  getOrdenesCompra: (params?: { estado?: string; proveedor?: number }) =>
    api.get("/compras/ordenes-compra/", { params }),
  
  getOrdenCompra: (id: number) =>
    api.get(`/compras/ordenes-compra/${id}/`),
  
  createOrdenCompra: (data: any) =>
    api.post("/compras/ordenes-compra/", data),
  
  updateOrdenCompra: (id: number, data: any) =>
    api.put(`/compras/ordenes-compra/${id}/`, data),
  
  marcarEnviada: (id: number) =>
    api.post(`/compras/ordenes-compra/${id}/marcar_enviada/`),
  
  enviarEmail: (id: number, data: { email: string; mensaje?: string }) =>
    api.post(`/compras/ordenes-compra/${id}/enviar_email/`, data),
  
  generarPDF: (id: number) =>
    api.get(`/compras/ordenes-compra/${id}/generar_pdf/`, { responseType: 'blob' }),
  
  cancelarOC: (id: number) =>
    api.post(`/compras/ordenes-compra/${id}/cancelar/`),
  
  // Recepciones
  getCompras: (params?: { proveedor?: number; pagado?: boolean }) =>
    api.get("/compras/compras/", { params }),
  
  createRecepcion: (data: any) =>
    api.post("/compras/compras/", data),
  
  // Pagos
  getPagosProveedores: (params?: { proveedor?: number; compra?: number }) =>
    api.get("/compras/pagos-proveedores/", { params }),
  
  createPagoProveedor: (data: any) =>
    api.post("/compras/pagos-proveedores/", data),
};
```

### comprasQueries.ts

```typescript
// frontend/panaderia-interfaz/src/features/Compras/hooks/queries/comprasQueries.ts

import { useQuery } from "@tanstack/react-query";
import { comprasApi } from "../../api/comprasApi";

export const useOrdenesCompraQuery = (filters?: { estado?: string; proveedor?: number }) => {
  return useQuery({
    queryKey: ["ordenes-compra", filters],
    queryFn: () => comprasApi.getOrdenesCompra(filters),
  });
};

export const useOrdenCompraQuery = (id: number) => {
  return useQuery({
    queryKey: ["orden-compra", id],
    queryFn: () => comprasApi.getOrdenCompra(id),
    enabled: !!id,
  });
};

export const useComprasQuery = (filters?: { proveedor?: number; pagado?: boolean }) => {
  return useQuery({
    queryKey: ["compras", filters],
    queryFn: () => comprasApi.getCompras(filters),
  });
};
```

### comprasMutations.ts

```typescript
// frontend/panaderia-interfaz/src/features/Compras/hooks/mutations/comprasMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { comprasApi } from "../../api/comprasApi";

export const useCreateOrdenCompraMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: comprasApi.createOrdenCompra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-compra"] });
    },
  });
};

export const useMarcarEnviadaMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => comprasApi.marcarEnviada(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-compra"] });
    },
  });
};

export const useCreateRecepcionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: comprasApi.createRecepcion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-compra"] });
      queryClient.invalidateQueries({ queryKey: ["compras"] });
    },
  });
};

export const useCreatePagoProveedorMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: comprasApi.createPagoProveedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["pagos-proveedores"] });
    },
  });
};
```

---

## 🎨 Componentes UI

### ComprasIndex.tsx (Principal)

```typescript
// frontend/panaderia-interfaz/src/features/Compras/components/ComprasIndex.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ComprasTable } from "./ComprasTable";
import { OrdenCompraForm } from "./OrdenCompraForm";
import { OrdenCompraDetalles } from "./OrdenCompraDetalles";

export const ComprasIndex = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedOC, setSelectedOC] = useState<number | null>(null);
  const [editingOC, setEditingOC] = useState<number | null>(null);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Órdenes de Compra</h1>
          <p className="text-gray-500">Gestiona las órdenes de compra a proveedores</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Orden de Compra
        </Button>
      </div>

      <ComprasTable
        onViewDetails={(id) => setSelectedOC(id)}
        onEdit={(id) => setEditingOC(id)}
      />

      {showForm && (
        <OrdenCompraForm
          ordenId={editingOC}
          onClose={() => {
            setShowForm(false);
            setEditingOC(null);
          }}
        />
      )}

      {selectedOC && (
        <OrdenCompraDetalles
          ordenId={selectedOC}
          onClose={() => setSelectedOC(null)}
        />
      )}
    </div>
  );
};
```

### Componentes Clave a Implementar

1. **OrdenCompraForm** - Similar a `OrdenesForm.tsx` de ventas
   - Selección de proveedor
   - Fechas de emisión y entrega esperada
   - Dirección de envío
   - Tabla de productos (MP y PR)
   - Cálculos automáticos de totales

2. **OrdenCompraDetalles** - Similar a `OrdenesDetalles.tsx`
   - Vista de OC completa
   - Botones de acción según estado:
     - Enviar Email
     - Descargar PDF
     - Recepcionar
     - Cancelar

3. **RecepcionForm** - Nuevo componente crítico
   - Lista de productos de la OC
   - Por cada producto:
     - Input de cantidad recibida
     - Sección de lotes (repetible):
       - Cantidad del lote
       - Fecha de caducidad
       - Costo unitario
   - Número de factura del proveedor
   - Notas de recepción

4. **PagoProveedorForm** - Formulario de registro de pago
   - Selección de compra
   - Monto pendiente (solo lectura)
   - Monto a pagar
   - Método de pago
   - Referencia

---

## 🔄 Flujo de Navegación

```
ComprasIndex
    │
    ├─► OrdenCompraForm (Crear/Editar)
    │       │
    │       └─► Guardar → Volver a ComprasIndex
    │
    └─► ComprasTable → Click en fila
            │
            └─► OrdenCompraDetalles
                    │
                    ├─► Enviar Email → EmailDialog
                    ├─► Descargar PDF
                    ├─► Recepcionar → RecepcionForm
                    │                      │
                    │                      └─► Crear Compra + Lotes
                    │
                    └─► Registrar Pago → PagoProveedorForm
```

1. CREAR OC (Estado: "Borrador")
   └─ Formulario con proveedor, dirección, items, totales
   └─ Se guarda OrdenesCompra + DetalleOrdenesCompra

2. ENVIAR OC (Estado: "Borrador" → "Enviada")
   ├─ Opción A: Marcar como enviada directamente
   └─ Opción B: Enviar email con PDF adjunto
      └─ Actualizar: email_enviado=True, fecha_email_enviado=now()

3. RECEPCIONAR MERCANCÍA (Estado: "Enviada" → "Recibida Parcial/Completa")
   └─ Formulario de recepción:
      ├─ Por cada línea de DetalleOrdenesCompra:
      │  ├─ Ingresar cantidad_recibida
      │  ├─ Ingresar fecha_caducidad (para cada lote)
      │  └─ Puede crear múltiples lotes si vienen fechas diferentes
      │
      ├─ Crear registro de Compras
      ├─ Crear DetalleCompras por cada línea
      ├─ Crear LotesMateriasPrimas o LotesProductosReventa
      │  └─ Con detalle_oc, proveedor, fecha_caducidad, etc.
      │
      ├─ Actualizar cantidad_recibida en DetalleOrdenesCompra
      ├─ Actualizar stock automático (via signals existentes)
      └─ Cambiar estado OC:
         └─ Si todo recibido: "Recibida Completa"
         └─ Si parcial: "Recibida Parcial"

4. REGISTRAR PAGO (Separado de recepción)
   └─ Formulario de pago:
      ├─ Seleccionar Compra o OC
      ├─ Monto a pagar (puede ser parcial)
      ├─ Método de pago
      ├─ Referencia
      └─ Crear PagosProveedores
      └─ Actualizar monto_pendiente_pago_usd en Compras
      └─ Si monto_pendiente = 0: pagado=True
---

Botones de Acción (Según estado)
Si estado = "Emitida":

📧 Enviar Email (botón azul)
📄 Descargar PDF (botón gris)
🚫 Cancelar OC (botón rojo, esquina derecha)
Si estado = "Enviada" o "Recibida Parcial":

📦 Recepcionar Mercancía (botón verde destacado)
📄 Descargar PDF (botón gris)
🚫 Cancelar OC (botón rojo)
Si estado = "Recibida Completa":

💰 Registrar Pago (botón verde)
📄 Descargar PDF (botón gris)
📊 Ver Recepciones (botón azul)

## 👉 Continúa en `05_PASOS_IMPLEMENTACION.md`
