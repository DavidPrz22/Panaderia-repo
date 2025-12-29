import type { Permissions } from "@/features/Authentication/types/types";

export const PERMISSIONS: Permissions = {
    // Vendedor: READ-only for materias primas and products, CRUD for clients/sales/notifications
    vendedor: [
        // View only - Materias Primas & Products
        'view:materias_primas',
        'view:productos_elaborados',
        'view:productos_reventa',

        // Full CRUD - Clients
        'view:clientes',
        'add:clientes',
        'edit:clientes',
        'delete:clientes',

        // Full CRUD - Sales Orders
        'view:ordenes_venta',
        'add:ordenes_venta',
        'edit:ordenes_venta',
        'delete:ordenes_venta',

        // Full CRUD - Notifications
        'view:notificaciones',
        'add:notificaciones',
        'edit:notificaciones',
        'delete:notificaciones',

        // View - Dashboard
        'view:dashboard',

        // Future: Point of Sale
        'view:punto_venta',
        
        // Lots
        'view:lots'
    ],

    // Gerente: Full access to everything (same as Admin)
    gerente: [
        // Materias Primas
        'view:materias_primas',
        'add:materias_primas',
        'edit:materias_primas',
        'delete:materias_primas',

        // Productos Elaborados
        'view:productos_elaborados',
        'add:productos_elaborados',
        'edit:productos_elaborados',
        'delete:productos_elaborados',

        // Productos Reventa
        'view:productos_reventa',
        'add:productos_reventa',
        'edit:productos_reventa',
        'delete:productos_reventa',

        // Clientes
        'view:clientes',
        'add:clientes',
        'edit:clientes',
        'delete:clientes',

        // Ordenes de Venta
        'view:ordenes_venta',
        'add:ordenes_venta',
        'edit:ordenes_venta',
        'delete:ordenes_venta',

        // Recetas
        'view:recetas',
        'add:recetas',
        'edit:recetas',
        'delete:recetas',

        // Producción
        'view:produccion',
        'add:produccion',
        'edit:produccion',
        'delete:produccion',

        // Compras
        'view:compras',
        'add:compras',
        'edit:compras',
        'delete:compras',

        // Ordenes de Compra
        'view:ordenes_compra',
        'add:ordenes_compra',
        'edit:ordenes_compra',
        'delete:ordenes_compra',

        // Proveedores
        'view:proveedores',
        'add:proveedores',
        'edit:proveedores',
        'delete:proveedores',

        // Transformación
        'view:transformacion',
        'add:transformacion',
        'edit:transformacion',
        'delete:transformacion',

        // Notificaciones
        'view:notificaciones',
        'add:notificaciones',
        'edit:notificaciones',
        'delete:notificaciones',

        // Dashboard
        'view:dashboard',

        // Reportes
        'view:reportes',
        'add:reportes',
        'edit:reportes',
        'delete:reportes',

        // Punto de Venta
        'view:punto_venta',
        'add:punto_venta',
        'edit:punto_venta',
        'delete:punto_venta',

        // Lots
        'view:lots',
        'add:lots',
        'edit:lots',
        'delete:lots',
    ],

    // Admin: Full access to everything (same as Gerente)
    admin: [
        // Materias Primas
        'view:materias_primas',
        'add:materias_primas',
        'edit:materias_primas',
        'delete:materias_primas',

        // Productos Elaborados
        'view:productos_elaborados',
        'add:productos_elaborados',
        'edit:productos_elaborados',
        'delete:productos_elaborados',

        // Productos Reventa
        'view:productos_reventa',
        'add:productos_reventa',
        'edit:productos_reventa',
        'delete:productos_reventa',

        // Clientes
        'view:clientes',
        'add:clientes',
        'edit:clientes',
        'delete:clientes',

        // Ordenes de Venta
        'view:ordenes_venta',
        'add:ordenes_venta',
        'edit:ordenes_venta',
        'delete:ordenes_venta',

        // Recetas
        'view:recetas',
        'add:recetas',
        'edit:recetas',
        'delete:recetas',

        // Producción
        'view:produccion',
        'add:produccion',
        'edit:produccion',
        'delete:produccion',

        // Compras
        'view:compras',
        'add:compras',
        'edit:compras',
        'delete:compras',

        // Ordenes de Compra
        'view:ordenes_compra',
        'add:ordenes_compra',
        'edit:ordenes_compra',
        'delete:ordenes_compra',

        // Proveedores
        'view:proveedores',
        'add:proveedores',
        'edit:proveedores',
        'delete:proveedores',

        // Transformación
        'view:transformacion',
        'add:transformacion',
        'edit:transformacion',
        'delete:transformacion',

        // Notificaciones
        'view:notificaciones',
        'add:notificaciones',
        'edit:notificaciones',
        'delete:notificaciones',

        // Dashboard
        'view:dashboard',

        // Reportes
        'view:reportes',
        'add:reportes',
        'edit:reportes',
        'delete:reportes',

        // Punto de Venta
        'view:punto_venta',
        'add:punto_venta',
        'edit:punto_venta',
        'delete:punto_venta',

        // Lots
        'view:lots',
        'add:lots',
        'edit:lots',
        'delete:lots',

        // User Management (Admin only)
        'view:usuarios',
        'add:usuarios',
        'edit:usuarios',
        'delete:usuarios',
    ],
};