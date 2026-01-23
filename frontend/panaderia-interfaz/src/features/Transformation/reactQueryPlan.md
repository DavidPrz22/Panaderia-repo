# Plan de Refactorización: Módulo de Transformación

Este plan detalla la migración del módulo de Transformación hacia un enfoque más robusto utilizando **React Hook Form**, **Zod** para validación, **React Query** para el estado del servidor y **Sonner** para notificaciones.

## 🎯 Objetivos
- **Type Safety**: Garantizar que los datos que viajan entre componentes y API sean consistentes.
- **Validación Robusta**: Implementar validaciones en tiempo real para evitar errores de usuario.
- **Simplificación del Estado**: Eliminar el uso excesivo de `useState` manual y `Context` innecesario a favor de formularios controlados y caché de React Query.
- **Mejor UX**: Feedbacks visuales claros (loading states, toasts, validaciones).

---

## 🛠️ Fase 1: Esquemas y Tipos (Zod)
Actualizar el archivo `src/features/Transformation/schemas/schemas.ts`:
1.  **Corregir Mensajes**: Ajustar `EjecutarTransformacionSchema` para que los mensajes de error sean coherentes (actualmente mencionan "3 caracteres" para campos numéricos).
2.  **Validaciones de Negocio**:
    - `nombre_transformacion`: Min 3, Max 100.
    - `cantidad_origen` y `cantidad_destino`: Deben ser números positivos (> 0).
3.  **Exportar Tipos**: Asegurar que todos los esquemas tengan su correspondiente `z.infer`.

## 🛠️ Fase 2: Refactorización de "Nueva Transformación"
Actualizar `src/features/Transformation/components/NuevaTransformacionBtn.tsx`:
1.  **Integrar React Hook Form**:
    - Reemplazar estados locales por `useForm<TTransformacionSchema>`.
    - Usar resolver de Zod.
2.  **Limpieza de Props/Context**: Eliminar la dependencia de `useTransformacionContext` para crear nuevas transformaciones. Cada formulario debe ser autónomo.
3.  **Notifications**: Implementar `toast.success` y `toast.error` usando Sonner.

## 🛠️ Fase 3: Refactorización de "Selección de Transformación"
Actualizar `src/features/Transformation/components/Selección.tsx`:
1.  **Formulario de Ejecución**: Envolver los componentes `Search...` en un `<form>`.
2.  **Controladores**: Usar el componente `<Controller />` de React Hook Form para integrar los selectores personalizados (`SearchProductsOrigin`, etc.) con el estado del formulario.
3.  **Validación de Ejecución**: El botón "Ejecutar Transformación" debe habilitarse solo cuando el esquema `EjecutarTransformacionSchema` sea válido.
4.  **Botón de Acción**: Refactorizar `BotonEjecutarTransformacion` para que simplemente sea un botón de submit o reciba los datos validados del form.

## 🛠️ Fase 4: Edición y Listado
1.  **Refactorizar `EditingModalTransformacion.tsx`**:
    - Utilizar `react-hook-form` con el mismo esquema de creación.
    - Cargar valores por defecto (`reset`) cuando se seleccione una transformación para editar.
2.  **Simplificar `RegistrosBtn.tsx`**: Limpiar la lógica de manejo de estado y delegar la edición al modal refactorizado.

## 🛠️ Fase 5: Limpieza de Deuda Técnica
1.  **Eliminar `TransformacionContext`**: Si después de las fases 2, 3 y 4 el contexto queda vacío o con lógica mínima, eliminarlo para reducir la complejidad del árbol de componentes.
2.  **Manejo de Errores Global**: Asegurar que las mutaciones de React Query (`mutations.ts`) manejen los errores de API de forma centralizada si es posible.

---

## ✅ Checklist de Implementación
- [x] Esquemas de Zod validados y consistentes.
- [ ] `NuevaTransformacionBtn` usa RHF + Zod.
- [ ] `Selección.tsx` usa RHF + Zod + Controller.
- [ ] `EditingModalTransformacion` usa RHF + Zod.
- [ ] Feedback visual con Sonner en todas las acciones (Crear, Editar, Eliminar, Ejecutar).
- [ ] `TransformacionContext` eliminado o minimizado.
- [ ] Loading states visibles en todos los botones de acción.