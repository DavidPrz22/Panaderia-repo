# Plan de Refactorización a React Query: Feature Transformation

El objetivo de esta refactorización es migrar la gestión del estado del servidor (Transformaciones) de un `useState`/`useEffect` manual y `Context API` hacia **TanStack Query (React Query) v5**, mejorando el rendimiento, la caché y la experiencia de usuario.

## 1. Arquitectura de Estado
*   **Query Keys**: Centralizar las llaves en un objeto `transformationKeys` dentro de `src/features/Transformation/hooks/queries/transformationKeys.ts`.
*   **Queries**: Crear hooks específicos para obtener la lista de transformaciones y búsquedas persistentes.
*   **Mutations**: Consolidar las operaciones de escritura (Crear, Editar, Eliminar, Ejecutar) en hooks reactivos que manejen la invalidación de caché automáticamente.

## 2. Definición de Hooks

### Queries (`hooks/queries/queries.ts`)
1.  **`useTransformacionesQuery`**:
    *   Usa `getTransformaciones` de la API.
    *   Gestiona la caché global de la lista de transformaciones.
    *   Implementa `staleTime` para evitar peticiones redundantes al navegar.

### Mutations (`hooks/mutations/mutations.ts`)
1.  **`useCreateTransformacionMutation`**:
    *   Llama a `createTransformacion`.
    *   **onSuccess**: Invalida `['transformaciones']` y muestra toast de éxito.
2.  **`useUpdateTransformacionMutation`**:
    *   Llama a `updateTransformacion`.
    *   **onSuccess**: Invalida `['transformaciones']` y muestra toast de éxito.
3.  **`useDeleteTransformacionMutation`**:
    *   Llama a `deleteTransformacion`.
    *   **onSuccess**: Invalida `['transformaciones']` y muestra toast de éxito.
4.  **`useEjecutarTransformacionMutation`**: (Ya existente) Refinar para asegurar invalidación de stocks si aplica.

## 3. Hoja de Ruta de Refactorización

### 🟢 Fase 1: Extracción de Lógica (Hooks)
*   [ ] Crear `transformation query options in /home/davidprz/projects/PanaderiaSystem/frontend/panaderia-interfaz/src/features/Transformation/hooks/queries/TransformacionQueryOptions.tsx`.
*   [ ] Crear `useTransformacionesQuery` en `queries.ts`.
*   [ ] Crear `useCreateTransformacionMutation`, `useUpdateTransformacionMutation` y `useDeleteTransformacionMutation` en `mutations.ts`.

### 🟡 Fase 2: Refactorización de Componentes
1.  **`RegistroBtn.tsx`**:
    *   Eliminar el `useEffect` manual y el estado `transformacion` local/context.
    *   Consumir `useTransformacionesQuery`.
    *   Usar `useDeleteTransformacionMutation` para la eliminación.
    *   Pasar `isPending` al componente `ModalButtons`.

2.  **`NuevaTransformacionBtn.tsx`**:
    *   Eliminar `loading`, `error`, `success` del contexto (usar los proporcionados por la mutación).
    *   Migrar `onSubmit` para usar `useCreateTransformacionMutation.mutate`.
    *   Integrar `toast` de `sonner` para feedback.

3.  **`EditingModalTransformacion.tsx`**:
    *   Migrar la lógica de guardado a `useUpdateTransformacionMutation`.
    *   Manejar estados de carga y error directamente desde la mutación.

4.  **`BotonEjecutarTransformacion.tsx`**:
    *   Asegurar que usa `useEjecutarTransformacionMutation`.

### 🔴 Fase 3: Limpieza de Contexto
*   [ ] Eliminar variables de estado del servidor de `TransformacionContext` (`loading`, `error`, `success`, `transformacion`).
*   [ ] Mantener el contexto únicamente para estado UI efímero (filtros de búsqueda, IDs seleccionados, estados de modales).

## 4. Criterios de Éxito
*   [ ] Las transformaciones se actualizan instantáneamente en la UI tras crear/editar/eliminar sin recargar la página.
*   [ ] No hay duplicidad de datos en memoria (Caché centralizada).
*   [ ] Manejo consistente de errores mediante Toasts.
*   [ ] El código de los componentes es más declarativo y fácil de leer.
