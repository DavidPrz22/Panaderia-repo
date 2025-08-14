# PanaderiaSystem - Sistema de Gestión de Panadería

## 📋 Resumen del Proyecto

PanaderiaSystem es una aplicación web completa para la gestión integral de una panadería, desarrollada con Django REST Framework en el backend y React con TypeScript en el frontend. El sistema maneja inventarios, producción, compras, ventas, recetas y usuarios con un enfoque modular y escalable.

## 🏗️ Arquitectura General

### Backend (Django REST Framework)
- **Framework**: Django 5.2.1 con Django REST Framework
- **Base de datos**: PostgreSQL (configurado con psycopg2)
- **Autenticación**: JWT con djangorestframework_simplejwt
- **CORS**: Habilitado para comunicación con frontend
- **Estructura**: Aplicaciones modulares por dominio de negocio

### Frontend (React + TypeScript)
- **Framework**: React 19.1.0 con TypeScript
- **Bundler**: Vite 7.0.4
- **Routing**: React Router DOM 7.6.1
- **Estado**: TanStack React Query 5.83.0
- **Formularios**: React Hook Form con Zod para validación
- **Estilos**: TailwindCSS 4.1.11
- **HTTP Client**: Axios

## 🗂️ Estructura del Backend

### 1. **App Core** (`apps.core`)
**Propósito**: Modelos base y configuraciones compartidas por toda la aplicación.

**Modelos principales**:
- `UnidadesDeMedida`: Gestión de unidades (peso, volumen, unidad, longitud)
- `CategoriasMateriaPrima`: Categorización de materias primas
- `CategoriasProductosElaborados`: Categorización de productos elaborados (con flag `es_intermediario`)
- `CategoriasProductosReventa`: Categorización de productos de reventa
- `MetodosDePago`: Métodos de pago disponibles
- `EstadosOrdenVenta`: Estados de órdenes de venta
- `EstadosOrdenCompra`: Estados de órdenes de compra

**Funcionalidad**:
- Proporciona datos maestros para el resto de aplicaciones
- Define constantes y configuraciones globales
- Centraliza tipos de datos comunes

**API Endpoints**:
- `/api/unidades-medida/`
- `/api/categorias-materiaprima/`
- `/api/categorias-producto-intermedio/`
- `/api/categorias-producto-elaborado/`

### 2. **App Users** (`apps.users`)
**Propósito**: Gestión de usuarios y autenticación del sistema.

**Modelos principales**:
- `User`: Usuario personalizado basado en AbstractBaseUser
  - Campos: username, email, full_name, rol, is_staff, is_superuser, is_active
  - Roles: Gerente, Vendedor, Administrador

**Funcionalidad**:
- Autenticación JWT personalizada
- Gestión de roles y permisos
- CRUD de usuarios

**API Endpoints**:
- `/api/token/` - Obtener token JWT
- `/api/token/refresh/` - Refrescar token
- `/api/logout/` - Cerrar sesión
- `/api/users/` - CRUD de usuarios

### 3. **App Inventario** (`apps.inventario`)
**Propósito**: Gestión completa del inventario incluyendo materias primas, productos elaborados y productos de reventa.

**Modelos principales**:

**Materias Primas**:
- `MateriasPrimas`: Datos básicos de materias primas
  - Control de stock actual y punto de reorden
  - Gestión de empaques estándar
  - Categorización y descripción
- `LotesMateriasPrimas`: Gestión por lotes con fechas de caducidad
  - Trazabilidad por proveedor
  - Control de stock por lote
  - Costos unitarios

**Productos Elaborados**:
- `ProductosElaborados`: Modelo base para productos elaborados
  - Manejo de venta por unidad o peso/volumen
  - Control de precios y stock
  - Diferenciación entre productos finales e intermedios
- `ProductosIntermedios`: Proxy model para productos intermedios (sin precio de venta)
- `ProductosFinales`: Proxy model para productos finales (con precio de venta)
- `LotesProductosElaborados`: Gestión por lotes de productos elaborados

**Productos de Reventa**:
- `ProductosReventa`: Productos comprados para revender
- `LotesProductosReventa`: Gestión por lotes de productos de reventa

**Funcionalidad**:
- Actualización automática de stock mediante signals
- Validaciones de negocio (productos intermedios vs finales)
- Gestión de lotes con fechas de caducidad
- Control de puntos de reorden

**API Endpoints**:
- `/api/materiaprima/`
- `/api/lotesmateriaprima/`
- `/api/materiaprimasearch/`
- `/api/productosintermedios/`
- `/api/productosfinales/`
- `/api/productosintermedios-detalles/`

### 4. **App Producción** (`apps.produccion`)
**Propósito**: Gestión de recetas, producción y transformaciones de productos.

**Modelos principales**:

**Recetas**:
- `Recetas`: Definición de recetas para productos elaborados
- `RecetasDetalles`: Componentes de cada receta (materias primas o productos intermedios)

**Producción**:
- `Produccion`: Registro de eventos de producción
- `DetalleProduccionConsumos`: Detalle de materias primas/productos intermedios consumidos

**Transformaciones**:
- `DefinicionTransformacion`: Definición de cómo transformar un producto en otro
- `LogTransformacion`: Registro de transformaciones realizadas

**Funcionalidad**:
- Gestión de recetas con componentes mixtos
- Registro de costos de producción
- Transformaciones de productos (ej: torta entera → porciones)
- Trazabilidad de consumos por lote

**API Endpoints**:
- `/api/recetas/`
- `/api/recetas-detalles/`
- `/api/recetas-search/`

### 5. **App Compras** (`apps.compras`)
**Propósito**: Gestión de proveedores y órdenes de compra.

**Modelos principales**:
- `Proveedores`: Información de proveedores
- `OrdenesCompra`: Órdenes de compra con estados y totales en USD/VES
- `DetalleOrdenesCompra`: Líneas de detalle de órdenes de compra

**Funcionalidad**:
- Gestión de proveedores
- Órdenes de compra con múltiples monedas
- Estados de órdenes (borrador, emitida, recibida, cancelada)
- Integración con inventario para recepción

**API Endpoints**:
- `/api/proveedores/`

### 6. **App Ventas** (`apps.ventas`)
**Propósito**: Gestión de clientes, ventas y órdenes de venta.

**Modelos principales**:

**Clientes y Ventas**:
- `Clientes`: Información de clientes
- `Ventas`: Registro de ventas realizadas
- `DetalleVenta`: Líneas de detalle de ventas con validaciones complejas

**Órdenes de Venta**:
- `OrdenVenta`: Órdenes de venta futuras
- `DetallesOrdenVenta`: Detalles de órdenes de venta

**Pagos**:
- `Pagos`: Registro de pagos asociados a ventas u órdenes

**Funcionalidad**:
- Ventas con múltiples métodos de pago
- Gestión de órdenes de venta
- Validaciones complejas para tipos de productos
- Manejo de múltiples monedas (USD/VES)

## 🎨 Estructura del Frontend

### Arquitectura por Features
El frontend está organizado por características (features) con estructura modular:

```
src/
├── features/
│   ├── Authentication/
│   ├── MateriaPrima/
│   ├── ProductosIntermedios/
│   └── Recetas/
├── components/        # Componentes compartidos
├── context/          # Contextos globales
├── api/             # Cliente HTTP
├── pages/           # Páginas principales
└── utils/           # Utilidades
```

### 1. **Feature Authentication**
**Propósito**: Manejo de autenticación y autorización.

**Componentes**:
- Formularios de login y registro
- Protección de rutas
- Gestión de tokens JWT

**Funcionalidades**:
- Login/logout con JWT
- Registro de usuarios
- Protección de rutas privadas
- Contexto de autenticación global

### 2. **Feature MateriaPrima**
**Propósito**: Gestión de materias primas desde el frontend.

**Componentes**:
- Formularios de creación/edición
- Tablas de listado
- Búsqueda y filtrado
- Gestión de categorías y unidades

**Funcionalidades**:
- CRUD completo de materias primas
- Búsqueda en tiempo real
- Validación de formularios con Zod
- Integración con React Query para cache

### 3. **Feature ProductosIntermedios**
**Propósito**: Gestión de productos intermedios.

**Componentes principales** (basado en archivos vistos):
- `ProductosIntermediosFormShared.tsx`: Formulario compartido (235 líneas)
- `PIInputForm.tsx`: Formulario de entrada
- `PITableBody.tsx`, `PITableHeader.tsx`, `PITablerow.tsx`: Componentes de tabla
- `RecetaSearchContainer.tsx`: Búsqueda de recetas
- `PendingTubeSpinner.tsx`: Componente de carga

**Funcionalidades**:
- Gestión específica de productos intermedios
- Búsqueda de recetas asociadas
- Formularios complejos con validación
- Estados de carga optimizados

### 4. **Feature Recetas**
**Propósito**: Gestión de recetas y sus componentes.

**Funcionalidades**:
- CRUD de recetas
- Gestión de componentes (materias primas + productos intermedios)
- Búsqueda y filtrado de recetas

### Tecnologías Frontend

**Estado y Cache**:
- TanStack React Query para cache de servidor
- Context API para estado global
- React Hook Form para estado de formularios

**Validación**:
- Zod para esquemas de validación
- Integración con React Hook Form

**Estilos**:
- TailwindCSS para estilos utilitarios
- Diseño responsive

**HTTP Client**:
- Axios configurado con interceptores
- Manejo automático de tokens JWT

## 🔄 Flujos de Datos Principales

### 1. **Flujo de Inventario**
1. **Compras** → Recepción → **Lotes** → **Stock**
2. **Producción** → Consumo de lotes → **Productos elaborados**
3. **Ventas** → Reducción de stock

### 2. **Flujo de Producción**
1. **Recetas** → Definición de componentes
2. **Producción** → Consumo según receta → **Producto terminado**
3. **Transformaciones** → Cambio de formato (ej: torta → porciones)

### 3. **Flujo de Ventas**
1. **Órdenes de venta** → Planificación
2. **Producción** → Según órdenes
3. **Ventas** → Entrega y facturación
4. **Pagos** → Registro de cobros

## 🔐 Seguridad y Autenticación

### Backend
- JWT tokens con refresh automático
- Roles de usuario (Admin, Gerente, Vendedor)
- Permisos por endpoint
- CORS configurado para frontend

### Frontend
- Protección de rutas con HOC
- Almacenamiento seguro de tokens
- Interceptores para renovación automática
- Logout automático en caso de tokens inválidos

## 📊 Características Técnicas Destacadas

### Backend
- **Signals**: Actualización automática de stock
- **Constraints**: Validaciones a nivel de base de datos
- **Proxy Models**: Reutilización de modelos con comportamiento específico
- **Managers personalizados**: Filtrado automático por tipo
- **Validaciones complejas**: Clean methods y constraints

### Frontend
- **Arquitectura modular**: Organización por features
- **TypeScript**: Tipado estático completo
- **React Query**: Cache inteligente y sincronización
- **Formularios optimizados**: Hook Form con validación Zod
- **Componentes reutilizables**: Patrón container/presentational

## 🚀 Configuración y Despliegue

### Backend
```bash
# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos PostgreSQL
# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
```

## 📝 Notas de Desarrollo

### Patrones Utilizados
- **Repository Pattern**: Separación de lógica de datos
- **Feature-based Architecture**: Organización por funcionalidades
- **Proxy Models**: Para especialización de comportamiento
- **Signal Pattern**: Para efectos secundarios automáticos

### Consideraciones de Escalabilidad
- Estructura modular permite crecimiento
- Separación clara de responsabilidades
- API RESTful estándar
- Cache inteligente en frontend
- Optimizaciones de consultas en backend

Este sistema proporciona una base sólida para la gestión integral de una panadería, con capacidad de expansión y mantenimiento a largo plazo.
