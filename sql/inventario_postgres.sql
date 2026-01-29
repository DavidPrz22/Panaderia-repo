-- Database Schema for Inventory Management (PostgreSQL Syntax)

-- Core Dependencies (required for Inventory)
CREATE TABLE UnidadesDeMedida (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(50) NOT NULL UNIQUE,
    abreviatura VARCHAR(10) NOT NULL,
    descripcion TEXT,
    tipo_medida VARCHAR(10) -- peso, volumen, unidad, longitud, otro
);

CREATE TABLE ConversionesUnidades (
    id SERIAL PRIMARY KEY,
    unidad_origen_id INTEGER NOT NULL,
    unidad_destino_id INTEGER NOT NULL,
    factor_conversion DECIMAL(15, 6) NOT NULL,
    FOREIGN KEY (unidad_origen_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (unidad_destino_id) REFERENCES UnidadesDeMedida(id),
    UNIQUE(unidad_origen_id, unidad_destino_id)
);

CREATE TABLE CategoriasMateriaPrima (
    id SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE CategoriasProductosElaborados (
    id SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_intermediario BOOLEAN DEFAULT FALSE
);

CREATE TABLE CategoriasProductosReventa (
    id SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE Notificaciones (
    id SERIAL PRIMARY KEY,
    tipo_notificacion VARCHAR(50) NOT NULL,
    tipo_producto VARCHAR(50) NOT NULL,
    producto_id INTEGER,
    descripcion TEXT,
    fecha_notificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    prioridad VARCHAR(50)
);

-- Inventario App Tables
CREATE TABLE MateriasPrimas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    unidad_medida_base_id INTEGER NOT NULL,
    stock_actual DECIMAL(10, 2) DEFAULT 0,
    SKU VARCHAR(50) UNIQUE,
    nombre_empaque_estandar VARCHAR(100),
    precio_compra_usd DECIMAL(10, 2),
    cantidad_empaque_estandar DECIMAL(10, 2),
    unidad_medida_empaque_estandar_id INTEGER,
    punto_reorden DECIMAL(10, 2) DEFAULT 0,
    fecha_ultima_actualizacion DATE,
    fecha_creacion_registro DATE DEFAULT CURRENT_DATE,
    fecha_modificacion_registro DATE,
    categoria_id INTEGER NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (unidad_medida_base_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (unidad_medida_empaque_estandar_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (categoria_id) REFERENCES CategoriasMateriaPrima(id)
);

CREATE TABLE ProductosElaborados (
    id SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL UNIQUE,
    SKU VARCHAR(50) UNIQUE,
    descripcion TEXT,
    unidad_produccion_id INTEGER,
    unidad_venta_id INTEGER,
    precio_venta_usd DECIMAL(10, 2),
    punto_reorden DECIMAL(10, 2) DEFAULT 0,
    stock_actual DECIMAL(10, 2) DEFAULT 0,
    categoria_id INTEGER NOT NULL,
    fecha_creacion_registro DATE DEFAULT CURRENT_DATE,
    fecha_modificacion_registro DATE,
    vendible_por_medida_real BOOLEAN,
    tipo_medida_fisica VARCHAR(10) DEFAULT 'PESO', -- UNIDAD, PESO, VOLUMEN
    es_intermediario BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (unidad_produccion_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (unidad_venta_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (categoria_id) REFERENCES CategoriasProductosElaborados(id)
);

CREATE TABLE ProductosReventa (
    id SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    SKU VARCHAR(50) UNIQUE,
    categoria_id INTEGER NOT NULL,
    marca VARCHAR(100),
    proveedor_preferido_id INTEGER,
    unidad_base_inventario_id INTEGER,
    unidad_venta_id INTEGER,
    factor_conversion DECIMAL(10, 4) DEFAULT 1,
    stock_actual DECIMAL(10, 2) DEFAULT 0,
    precio_venta_usd DECIMAL(10, 2) DEFAULT 0,
    precio_compra_usd DECIMAL(10, 2) DEFAULT 0,
    perecedero BOOLEAN DEFAULT FALSE,
    fecha_creacion_registro DATE DEFAULT CURRENT_DATE,
    fecha_modificacion_registro DATE,
    punto_reorden DECIMAL(10, 2),
    FOREIGN KEY (categoria_id) REFERENCES CategoriasProductosReventa(id),
    -- FOREIGN KEY (proveedor_preferido_id) REFERENCES Proveedores(id), -- Uncomment if Proveedores table exists
    FOREIGN KEY (unidad_base_inventario_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (unidad_venta_id) REFERENCES UnidadesDeMedida(id)
);

-- Note: Lotes depend on Compras tables (Proveedores, DetalleOrdenesCompra). 
-- Those are not included here unless requested, but the foreign key columns remain.

CREATE TABLE LotesMateriasPrimas (
    id SERIAL PRIMARY KEY,
    materia_prima_id INTEGER NOT NULL,
    proveedor_id INTEGER,
    fecha_recepcion DATE NOT NULL,
    fecha_caducidad DATE NOT NULL,
    cantidad_recibida DECIMAL(10, 2) NOT NULL,
    stock_actual_lote DECIMAL(10, 2) NOT NULL,
    costo_unitario_usd DECIMAL(10, 2) NOT NULL,
    detalle_oc_id INTEGER,
    estado VARCHAR(10) DEFAULT 'DISPONIBLE',
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (materia_prima_id) REFERENCES MateriasPrimas(id)
    -- FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id), -- Uncomment if Proveedores table exists
    -- FOREIGN KEY (detalle_oc_id) REFERENCES DetalleOrdenesCompra(id) -- Uncomment if DetalleOrdenesCompra table exists
);

CREATE TABLE LotesProductosReventa (
    id SERIAL PRIMARY KEY,
    producto_reventa_id INTEGER NOT NULL,
    fecha_recepcion DATE NOT NULL,
    fecha_caducidad DATE NOT NULL,
    cantidad_recibida DECIMAL(10, 2) DEFAULT 0,
    stock_actual_lote DECIMAL(10, 2) DEFAULT 0,
    coste_unitario_lote_usd DECIMAL(10, 2) DEFAULT 0,
    detalle_oc_id INTEGER,
    proveedor_id INTEGER,
    estado VARCHAR(10) DEFAULT 'DISPONIBLE',
    FOREIGN KEY (producto_reventa_id) REFERENCES ProductosReventa(id)
    -- FOREIGN KEY (detalle_oc_id) REFERENCES DetalleOrdenesCompra(id), -- Uncomment if DetalleOrdenesCompra table exists
    -- FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id) -- Uncomment if Proveedores table exists
);

CREATE TABLE LotesProductosElaborados (
    id SERIAL PRIMARY KEY,
    produccion_origen_id INTEGER NOT NULL,
    producto_elaborado_id INTEGER NOT NULL,
    cantidad_inicial_lote DECIMAL(10, 2) DEFAULT 0,
    stock_actual_lote DECIMAL(10, 2) DEFAULT 0,
    fecha_produccion DATE DEFAULT CURRENT_DATE,
    fecha_caducidad DATE NOT NULL,
    estado VARCHAR(10) DEFAULT 'DISPONIBLE',
    coste_total_lote_usd DECIMAL(10, 2) DEFAULT 0,
    peso_total_lote_gramos DECIMAL(10, 2),
    volumen_total_lote_ml DECIMAL(10, 2),
    -- FOREIGN KEY (produccion_origen_id) REFERENCES Produccion(id), -- Uncomment if Produccion table exists
    FOREIGN KEY (producto_elaborado_id) REFERENCES ProductosElaborados(id)
);
