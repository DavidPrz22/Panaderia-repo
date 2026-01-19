# API de Recetas - Campo Rendimiento

## Descripción
El campo `rendimiento` representa la cantidad de producto final que se obtiene al ejecutar una receta.

## Endpoints Afectados

### GET /api/recetas/
Retorna lista de recetas incluyendo rendimiento.

**Respuesta**:
```json
{
  "id": 1,
  "nombre": "Pan de Molde",
  "rendimiento": 2.500,
  "producto_elaborado": 5,
  ...
}
```

## Validaciones
- `rendimiento` debe ser un número decimal positivo
- Campo opcional (puede ser `null`)
- Máximo 10 dígitos, 3 decimales
