# Refactorización del Sistema de Búsqueda (Transformaciones)

## Objetivos
- **Optimización de UX**: Implementar debouncing para reducir la carga en el servidor y mejorar la fluidez.
- **Consistencia**: Unificar la lógica de búsqueda de productos (Origen vs Destino) bajo una misma interfaz y endpoint.
- **Robustez**: Manejar estados de carga, errores y validaciones de entrada (espacios en blanco, longitud mínima).

---

## 📋 Lista de Tareas

### Fase 1: Backend (Django)
- [ ] Implementar un action `@action(detail=False)` llamado `search` en `ProductosFinalesViewSet`.
- [ ] El endpoint debe recibir `q` (query) y `type` (`origen` | `destino`).
- [ ] Aplicar lógica de filtrado según `usado_en_transformaciones`:
    - `type=destino` -> `usado_en_transformaciones=True`
    - `type=origen`  -> `usado_en_transformaciones=False`
- [ ] Asegurar que la búsqueda sea `icontains` para insensibilidad a mayúsculas.

### Fase 2: Frontend Data (React Query)
- [ ] Implementar un hook `useDebounce` personalizado si no existe.
- [ ] Crear `useProductSearchQuery` en `TransformacionQueries.ts` que integre el debounce.
- [ ] Configurar las `queryOptions` para optimizar el cacheo (`staleTime`) y evitar re-fetchings innecesarios.
- [ ] Asegurar que el hook solo se dispare si `query.trim().length >= 2`.

### Fase 3: Refactorización de Componentes (UI)
- [ ] Crear un componente unificado `ProductSearchInput.tsx` que reemplace a `SearchProductsOrigin` y `SearchProductsDestino`.
- [ ] El componente debe aceptar un prop `type` para configurar la búsqueda.
- [ ] Mejorar la accesibilidad y el feedback visual del `SearchInput` (Shadcn UI).
- [ ] Asegurar que el primer caracter después de un espacio en blanco dispare la búsqueda correctamente.

### Fase 4: Integración y Limpieza
- [ ] Actualizar `Selección.tsx` para usar el nuevo componente unificado.
- [ ] Verificar que `SearchTransformaciones` también implemente debouncing para consistencia.
- [ ] Eliminar los componentes redundantes si ya no se utilizan.

---

## 🛠 Detalles Técnicos Sugeridos

### Hook de React Query con Debounce
```typescript
export const useProductSearchQuery = (query: string, type: 'origen' | 'destino') => {
  const debouncedQuery = useDebounce(query, 300);
  
  return useQuery({
    queryKey: ['products', 'search', type, debouncedQuery],
    queryFn: () => transformationService.searchProducts(debouncedQuery, type),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: Infinity, // 5 minutos de cache
  });
};
```

### Lógica de Filtrado Backend (Python)
```python
@action(detail=False, methods=['get'])
def search(self, request):
    query = request.query_params.get('q', '').strip()
    search_type = request.query_params.get('type', 'origen')
    
    queryset = self.get_queryset()
    
    # Filtrar según el uso en transformaciones
    if search_type == 'destino':
        queryset = queryset.filter(usado_en_transformaciones=True)
    else:
        queryset = queryset.filter(usado_en_transformaciones=False)
        
    # Filtrar por nombre si hay query
    if query:
        queryset = queryset.filter(nombre_producto__icontains=query)
        
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)
```

---

## 📝 Notas Adicionales
- La validación de "no buscar si es solo espacio en blanco" se maneja eficientemente en la propiedad `enabled` de React Query.
- Se debe considerar si otros tipos de productos (Materias Primas o Intermedios) podrían ser parte de una transformación a futuro para dejar la interfaz del backend flexible.
