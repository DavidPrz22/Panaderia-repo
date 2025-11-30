export const NOTIFICACIONES_TIPOS = {
  STOCK: 'Bajo stock',
  SIN_STOCK: 'Sin stock',
  VENCIMIENTO: 'Expiración',
  ENTREGAS: 'Entrega cercana'
} as const;

export const PRIORIDAD_TIPOS = {
    BAJO : 'Bajo', 
    MEDIO: 'Medio', 
    ALTO : 'Alto', 
    CRITICO : 'Crítico'
} as const


export const PRODUCTOS_TIPOS = {
    MATERIA_PRIMA : 'Materia prima', 
    PRODUCTOS_FINALES : 'Productos finales', 
    PRODUCTOS_INTERMEDIOS : 'Productos intermedios',
    PRODUCTOS_REVENTA : 'Productos de reventa', 
    ORDENES_VENTA : 'Ordenes de venta',
} as const