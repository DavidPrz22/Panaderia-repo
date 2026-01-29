# Plan de Implementación: Sistema de Rendimiento de Recetas

## Resumen Ejecutivo

Este plan detalla la implementación de un sistema de rendimiento para recetas de productos elaborados. El rendimiento representa la cantidad de producto final que se obtiene al ejecutar una receta, expresado en la unidad de medida del producto.

**Objetivo**: Permitir que las recetas especifiquen un rendimiento esperado que se utilizará como valor predeterminado en el módulo de producción.

---

## Fase 1: Backend - Modelo de Datos

### 1.1 Modificación del Modelo `Recetas`

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/backend/djangobackend/apps/produccion/models.py`

**Cambios**:
- Agregar campo `rendimiento` al modelo `Recetas` (línea 9-17)
- El campo debe ser opcional (`null=True, blank=True`)
- Tipo: `DecimalField` con precisión adecuada para cantidades de producción

**Implementación**:
```python
class Recetas(models.Model):
    nombre = models.CharField(max_length=255, null=True, blank=True)
    producto_elaborado = models.OneToOneField(ProductosElaborados, on_delete=models.SET_NULL, related_name='receta_producto_elaborado', null=True, blank=True, unique=True)
    rendimiento = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, help_text="Cantidad de producto que genera esta receta")
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    fecha_modificacion = models.DateTimeField(auto_now=True, null=True, blank=True)
    notas = models.TextField(max_length=250, null=True, blank=True)
```

**Consideraciones**:
- ✅ Campo opcional para mantener compatibilidad con recetas existentes
- ✅ `max_digits=10, decimal_places=3` para consistencia con otros campos de cantidad
- ✅ `help_text` para documentación en Django Admin

**Migración**:
```bash
python manage.py makemigrations produccion
python manage.py migrate
```

---

## Fase 2: Backend - Serialización

### 2.1 Actualización de `RecetasSerializer`

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/backend/djangobackend/apps/produccion/serializers.py`

**Cambios**:
- Agregar `'rendimiento'` al array `fields` en `RecetasSerializer.Meta` (línea 10-21)

**Implementación**:
```python
class RecetasSerializer(serializers.ModelSerializer):
    componente_receta = serializers.ListField(write_only=True, required=False)
    receta_relacionada = serializers.ListField(write_only=True, required=False)
    esCompuesta = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Recetas
        fields = [
            'id',
            'producto_elaborado', 
            'nombre',
            'rendimiento',  # ← NUEVO CAMPO
            'fecha_creacion',
            'fecha_modificacion',
            'notas',
            'componente_receta',
            'receta_relacionada',
            'esCompuesta'
        ]
```

**Validación**:
- El serializer manejará automáticamente la validación del tipo `Decimal`
- Valores `null` son permitidos según la definición del modelo

---

## Fase 3: Backend - ViewSet y Actions

### 3.1 Actualización de la Action `get_receta_detalles`

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/backend/djangobackend/apps/produccion/viewsets.py`

**Ubicación**: Método `get_receta_detalles` en `RecetasViewSet` (líneas 114-159)

**Cambios**:
- Incluir el campo `rendimiento` en la respuesta de la action
- El campo ya estará disponible automáticamente a través del serializer

**Verificación**:
```python
@action(detail=False, methods=['get'], url_path='get_receta_detalles')
def get_receta_detalles(self, request, *args, **kwargs):
    # ... código existente ...
    
    # El serializer ya incluirá 'rendimiento' automáticamente
    serializer = RecetasSerializer(receta)
    
    # Verificar que rendimiento esté en la respuesta
    response_data = {
        'receta': serializer.data,  # incluye 'rendimiento'
        'componentes': componentes_data,
        'subrecetas': subrecetas_data
    }
    
    return Response(response_data, status=status.HTTP_200_OK)
```

**Consideraciones**:
- ✅ No requiere cambios explícitos si el serializer está actualizado
- ✅ El campo será `null` para recetas sin rendimiento definido
- ⚠️ Verificar que el frontend maneje correctamente valores `null`

---

## Fase 4: Frontend - Schemas y Validación

### 4.1 Actualización del Schema de Recetas

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Recetas/schemas/schemas.ts`

**Cambios**:
- Agregar campo `rendimiento` al `recetasFormSchema`
- Validación: número positivo opcional

**Implementación**:
```typescript
export const recetasFormSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre no es válido",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  
  rendimiento: z.coerce
    .number()
    .positive({ message: "El rendimiento debe ser mayor que 0" })
    .optional()
    .or(z.literal(null))
    .or(z.literal("")),
  
  componente_receta: z.array(componentesRecetasSchema).min(1, {
    message: "El componente es requerido",
  }),
  
  notas: z
    .string()
    .refine((val) => !val || val.length >= 3, {
      message: "Las notas no pueden tener menos de 3 caracteres",
    })
    .refine((val) => !val || val.length <= 250, {
      message: "Las notas no pueden tener más de 250 caracteres",
    })
    .optional(),
  
  receta_relacionada: z.array(recetaRelacionadaSchema).default([]),
});

export type TRecetasFormSchema = z.infer<typeof recetasFormSchema>;
```

**Validaciones**:
- ✅ Campo opcional (puede ser `null`, `undefined` o string vacío)
- ✅ Si se proporciona, debe ser número positivo
- ✅ Coerción automática de string a número

---

## Fase 5: Frontend - Tipos TypeScript

### 5.1 Actualización de Interfaces de Recetas

**Archivos a revisar**:
- `/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Recetas/types/`
- Cualquier archivo que defina interfaces para `Receta` o `RecetaResponse`

**Cambios necesarios**:
```typescript
// Ejemplo de interfaz actualizada
interface Receta {
  id: number;
  nombre: string;
  producto_elaborado: number;
  rendimiento?: number | null;  // ← NUEVO CAMPO
  fecha_creacion: string;
  fecha_modificacion: string;
  notas?: string;
  esCompuesta: boolean;
}

interface RecetaDetalles {
  receta: Receta;  // Ya incluye rendimiento
  componentes: ComponenteReceta[];
  subrecetas: SubReceta[];
}
```

---

## Fase 6: Frontend - Formularios de Recetas

### 6.1 Actualización de `RecetasFormShared.tsx`

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Recetas/components/RecetasFormShared.tsx`

**Cambios**:
- Agregar campo de input para `rendimiento`
- Posicionar después del campo `nombre` y antes de `componentes`
- Usar input tipo `number` con validación de positivos

**Implementación sugerida**:
```tsx
<div className="form-group">
  <label htmlFor="rendimiento">
    Rendimiento
    <span className="optional-label">(Opcional)</span>
  </label>
  <input
    type="number"
    id="rendimiento"
    {...register("rendimiento", { valueAsNumber: true })}
    placeholder="Cantidad que produce esta receta"
    min="0"
    step="0.001"
    inputMode="decimal"
    onKeyDown={(e) => {
      // Prevenir entrada de caracteres no numéricos
      if (
        e.key === '-' || 
        e.key === 'e' || 
        e.key === 'E' || 
        e.key === '+'
      ) {
        e.preventDefault();
      }
    }}
    onPaste={(e) => {
      const pastedText = e.clipboardData.getData('text');
      if (!/^\d*\.?\d*$/.test(pastedText)) {
        e.preventDefault();
      }
    }}
    onWheel={(e) => e.currentTarget.blur()}
  />
  {errors.rendimiento && (
    <span className="error-message">{errors.rendimiento.message}</span>
  )}
  <small className="help-text">
    Cantidad de producto final que genera esta receta
  </small>
</div>
```

**Consideraciones de UX**:
- ✅ Campo claramente marcado como opcional
- ✅ Placeholder descriptivo
- ✅ Validación en tiempo real
- ✅ Prevención de valores negativos y notación científica
- ✅ Texto de ayuda para claridad

---

### 6.2 Actualización de `RecetasDetalles.tsx`

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Recetas/components/RecetasDetalles.tsx`

**Cambios**:
- Mostrar el rendimiento en el panel de detalles
- Manejar caso cuando `rendimiento` es `null` o `undefined`

**Implementación sugerida**:
```tsx
<div className="receta-detalles">
  <div className="detalle-row">
    <span className="detalle-label">Nombre:</span>
    <span className="detalle-value">{receta.nombre}</span>
  </div>
  
  {receta.rendimiento && (
    <div className="detalle-row">
      <span className="detalle-label">Rendimiento:</span>
      <span className="detalle-value">
        {receta.rendimiento} {unidadMedida}
      </span>
    </div>
  )}
  
  <div className="detalle-row">
    <span className="detalle-label">Fecha de creación:</span>
    <span className="detalle-value">
      {new Date(receta.fecha_creacion).toLocaleDateString()}
    </span>
  </div>
  
  {/* ... resto de los detalles ... */}
</div>
```

**Consideraciones**:
- ✅ Solo mostrar si existe valor de rendimiento
- ✅ Incluir unidad de medida del producto para contexto
- ✅ Formato numérico apropiado (considerar decimales)

---

## Fase 7: Frontend - Módulo de Producción

### 7.1 Actualización de `ProductionRegisterCard.tsx`

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Production/components/ProductionRegisterCard.tsx`

**Contexto**: Cuando se selecciona un producto y se obtiene su receta del backend.

**Cambios**:
- Capturar el valor de `rendimiento` de la receta
- Pasar el rendimiento como prop a componentes hijos

**Implementación sugerida**:
```tsx
// En el useEffect o handler que obtiene la receta
useEffect(() => {
  if (selectedProduct && recetaData) {
    const rendimiento = recetaData.receta.rendimiento;
    
    // Pasar rendimiento a ProductionCantidad o ProductionForm
    setRecetaRendimiento(rendimiento);
  }
}, [selectedProduct, recetaData]);

// Pasar como prop
<ProductionForm
  receta={recetaData}
  rendimiento={recetaRendimiento}
  // ... otras props
/>
```

---

### 7.2 Actualización de `ProductionCantidad.tsx`

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Production/components/ProductionCantidad.tsx`

**Cambios**:
- Recibir `rendimiento` como prop
- Establecer valor inicial del input basado en rendimiento
- Permitir que el usuario modifique el valor si lo desea

**Implementación sugerida**:
```tsx
interface ProductionCantidadProps {
  rendimiento?: number | null;
  value: number;
  onChange: (value: number) => void;
  unidadMedida: string;
}

export const ProductionCantidad: React.FC<ProductionCantidadProps> = ({
  rendimiento,
  value,
  onChange,
  unidadMedida
}) => {
  // Establecer valor inicial cuando se recibe rendimiento
  useEffect(() => {
    if (rendimiento && rendimiento > 0) {
      onChange(rendimiento);
    }
  }, [rendimiento]);

  return (
    <div className="production-cantidad">
      <label htmlFor="cantidad-produccion">
        Cantidad a Producir ({unidadMedida})
      </label>
      <input
        type="number"
        id="cantidad-produccion"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min="0"
        step="0.001"
        inputMode="decimal"
        onKeyDown={(e) => {
          if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
            e.preventDefault();
          }
        }}
        onWheel={(e) => e.currentTarget.blur()}
      />
      {rendimiento && (
        <small className="help-text">
          Rendimiento de receta: {rendimiento} {unidadMedida}
        </small>
      )}
    </div>
  );
};
```

**Lógica**:
- ✅ Si `rendimiento` existe y es > 0, establecer como valor inicial
- ✅ Si no existe rendimiento, mantener comportamiento actual
- ✅ Usuario puede modificar el valor en cualquier momento
- ✅ Mostrar indicador visual del rendimiento de la receta

---

### 7.3 Actualización de `ProductionForm.tsx`

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Production/components/ProductionForm.tsx`

**Cambios**:
- Agregar indicador visual del rendimiento de la receta
- Mostrar información contextual al usuario

**Implementación sugerida**:
```tsx
export const ProductionForm: React.FC<ProductionFormProps> = ({
  receta,
  rendimiento,
  // ... otras props
}) => {
  return (
    <form className="production-form">
      {/* Información de la receta */}
      <div className="receta-info">
        <h3>{receta.nombre}</h3>
        {rendimiento && (
          <div className="rendimiento-badge">
            <span className="badge-icon">📊</span>
            <span className="badge-text">
              Rendimiento: {rendimiento} {unidadMedida}
            </span>
          </div>
        )}
      </div>

      {/* Campo de cantidad */}
      <ProductionCantidad
        rendimiento={rendimiento}
        value={cantidadProduccion}
        onChange={setCantidadProduccion}
        unidadMedida={unidadMedida}
      />

      {/* ... resto del formulario ... */}
    </form>
  );
};
```




## Fase 8: Manejo de Errores

### 8.1 Backend - Validaciones

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/backend/djangobackend/apps/produccion/serializers.py`

**Validación personalizada**:
```python
class RecetasSerializer(serializers.ModelSerializer):
    # ... campos existentes ...
    
    def validate_rendimiento(self, value):
        """Validar que el rendimiento sea positivo si se proporciona"""
        if value is not None and value <= 0:
            raise serializers.ValidationError(
                "El rendimiento debe ser mayor que 0"
            )
        return value
    
    def validate(self, data):
        """Validaciones a nivel de objeto"""
        # Validar que el rendimiento sea razonable en relación a los componentes
        rendimiento = data.get('rendimiento')
        componentes = data.get('componente_receta', [])
        
        if rendimiento and componentes:
            # Aquí podrías agregar lógica para validar que el rendimiento
            # sea coherente con las cantidades de componentes
            pass
        
        return data
```

---

### 8.2 Frontend - Manejo de Errores en Formularios

**Implementación en formularios**:
```typescript
const onSubmit = async (data: TRecetasFormSchema) => {
  try {
    await createRecetaMutation.mutateAsync(data);
    toast.success('Receta creada exitosamente');
    navigate('/recetas');
  } catch (error) {
    if (error.response?.data?.rendimiento) {
      setError('rendimiento', {
        type: 'manual',
        message: error.response.data.rendimiento[0],
      });
    } else {
      toast.error('Error al crear la receta');
    }
  }
};
```

---

### 8.3 Frontend - Manejo de Errores en Producción

**Validación antes de iniciar producción**:
```typescript
const handleStartProduction = () => {
  // Validar que la cantidad sea válida
  if (cantidadProduccion <= 0) {
    toast.error('La cantidad a producir debe ser mayor que 0');
    return;
  }
  
  // Advertir si se desvía del rendimiento esperado
  if (rendimiento && Math.abs(cantidadProduccion - rendimiento) > rendimiento * 0.2) {
    const confirmed = window.confirm(
      `La cantidad ingresada (${cantidadProduccion}) difiere significativamente ` +
      `del rendimiento esperado (${rendimiento}). ¿Desea continuar?`
    );
    
    if (!confirmed) return;
  }
  
  // Proceder con la producción
  startProduction();
};
```

## Fase 9: Documentación

### 9.1 Documentación de API

**Archivo**: `/home/davidprz/projects/PanaderiaSystem/backend/docs/api/recetas.md`

**Contenido**:
```markdown
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
```

## Checklist de Implementación

### Backend
- [ ] Agregar campo `rendimiento` al modelo `Recetas`
- [ ] Crear y ejecutar migración
- [ ] Actualizar `RecetasSerializer` con campo `rendimiento`
- [ ] Verificar que `get_receta_detalles` incluye rendimiento
- [ ] Agregar validaciones en serializer
- [ ] Actualizar documentación de API

### Frontend - Recetas
- [ ] Actualizar `recetasFormSchema` con validación de rendimiento
- [ ] Actualizar interfaces TypeScript
- [ ] Agregar campo en `RecetasFormShared.tsx`
- [ ] Mostrar rendimiento en `RecetasDetalles.tsx`
- [ ] Implementar manejo de errores
- [ ] Escribir tests de componentes

### Frontend - Producción
- [ ] Actualizar `ProductionRegisterCard.tsx` para capturar rendimiento
- [ ] Modificar `ProductionCantidad.tsx` para usar rendimiento como valor inicial
- [ ] Agregar indicador visual en `ProductionForm.tsx`
- [ ] Implementar validaciones y advertencias
- [ ] Actualizar tipos TypeScript

---
