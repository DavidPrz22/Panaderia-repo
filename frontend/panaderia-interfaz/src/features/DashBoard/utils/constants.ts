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