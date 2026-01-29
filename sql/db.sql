-- Database Schema based on Django Models

-- Users App
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(254) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'Vendedor', -- Gerente, Vendedor, Admin
    is_staff BOOLEAN DEFAULT 0,
    is_superuser BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME,
    date_joined DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Core App
CREATE TABLE UnidadesDeMedida (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_completo VARCHAR(50) NOT NULL UNIQUE,
    abreviatura VARCHAR(10) NOT NULL,
    descripcion TEXT,
    tipo_medida VARCHAR(10) -- peso, volumen, unidad, longitud, otro
);

CREATE TABLE ConversionesUnidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unidad_origen_id INTEGER NOT NULL,
    unidad_destino_id INTEGER NOT NULL,
    factor_conversion DECIMAL(15, 6) NOT NULL,
    FOREIGN KEY (unidad_origen_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (unidad_destino_id) REFERENCES UnidadesDeMedida(id),
    UNIQUE(unidad_origen_id, unidad_destino_id)
);

CREATE TABLE CategoriasMateriaPrima (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE CategoriasProductosElaborados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_intermediario BOOLEAN DEFAULT 0
);

CREATE TABLE CategoriasProductosReventa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE MetodosDePago (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_metodo VARCHAR(100) NOT NULL,
    requiere_referencia BOOLEAN DEFAULT 0
);

CREATE TABLE EstadosOrdenVenta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_estado VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE EstadosOrdenCompra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_estado VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE Notificaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_notificacion VARCHAR(50) NOT NULL,
    tipo_producto VARCHAR(50) NOT NULL,
    producto_id INTEGER,
    descripcion TEXT,
    fecha_notificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT 0,
    prioridad VARCHAR(50)
);

-- Compras App
CREATE TABLE Proveedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_proveedor VARCHAR(100) NOT NULL,
    apellido_proveedor VARCHAR(100),
    nombre_comercial VARCHAR(100),
    email_contacto VARCHAR(100),
    telefono_contacto VARCHAR(100),
    fecha_creacion_registro DATE DEFAULT CURRENT_DATE,
    usuario_registro_id INTEGER,
    notas TEXT,
    FOREIGN KEY (usuario_registro_id) REFERENCES Users(id)
);

CREATE TABLE OrdenesCompra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proveedor_id INTEGER NOT NULL,
    usuario_creador_id INTEGER NOT NULL,
    fecha_emision_oc DATE NOT NULL,
    fecha_entrega_esperada DATE NOT NULL,
    fecha_entrega_real DATE,
    estado_oc_id INTEGER NOT NULL,
    monto_total_oc_usd DECIMAL(10, 3) DEFAULT 0,
    monto_total_oc_ves DECIMAL(10, 3) DEFAULT 0,
    metodo_pago_id INTEGER NOT NULL,
    tasa_cambio_aplicada DECIMAL(10, 3) DEFAULT 0,
    direccion_envio TEXT,
    fecha_envio_oc DATE,
    email_enviado BOOLEAN DEFAULT 0,
    fecha_email_enviado DATETIME,
    terminos_pago VARCHAR(100),
    notas TEXT,
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id),
    FOREIGN KEY (usuario_creador_id) REFERENCES Users(id),
    FOREIGN KEY (estado_oc_id) REFERENCES EstadosOrdenCompra(id),
    FOREIGN KEY (metodo_pago_id) REFERENCES MetodosDePago(id)
);

CREATE TABLE Compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_compra_id INTEGER NOT NULL,
    proveedor_id INTEGER NOT NULL,
    usuario_recepcionador_id INTEGER NOT NULL,
    pagado BOOLEAN DEFAULT 0,
    monto_pendiente_pago_usd DECIMAL(10, 2) DEFAULT 0,
    fecha_recepcion DATE NOT NULL,
    numero_factura_proveedor VARCHAR(100),
    numero_remision VARCHAR(100),
    monto_recepcion_usd DECIMAL(10, 2) DEFAULT 0,
    monto_recepcion_ves DECIMAL(10, 2) DEFAULT 0,
    tasa_cambio_aplicada DECIMAL(10, 2) DEFAULT 0,
    notas TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (orden_compra_id) REFERENCES OrdenesCompra(id),
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id),
    FOREIGN KEY (usuario_recepcionador_id) REFERENCES Users(id)
);

CREATE TABLE PagosProveedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    compra_asociada_id INTEGER,
    orden_compra_asociada_id INTEGER,
    proveedor_id INTEGER NOT NULL,
    fecha_pago DATE NOT NULL,
    metodo_pago_id INTEGER NOT NULL,
    monto_pago_usd DECIMAL(10, 3) NOT NULL,
    monto_pago_ves DECIMAL(10, 3) NOT NULL,
    tasa_cambio_aplicada DECIMAL(10, 3) NOT NULL,
    referencia_pago VARCHAR(100),
    numero_comprobante VARCHAR(100),
    usuario_registrador_id INTEGER NOT NULL,
    notas TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (compra_asociada_id) REFERENCES Compras(id),
    FOREIGN KEY (orden_compra_asociada_id) REFERENCES OrdenesCompra(id),
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id),
    FOREIGN KEY (metodo_pago_id) REFERENCES MetodosDePago(id),
    FOREIGN KEY (usuario_registrador_id) REFERENCES Users(id)
);

-- Inventario App
CREATE TABLE MateriasPrimas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    es_intermediario BOOLEAN DEFAULT 0,
    FOREIGN KEY (unidad_produccion_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (unidad_venta_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (categoria_id) REFERENCES CategoriasProductosElaborados(id)
);

CREATE TABLE ProductosReventa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    perecedero BOOLEAN DEFAULT 0,
    fecha_creacion_registro DATE DEFAULT CURRENT_DATE,
    fecha_modificacion_registro DATE,
    punto_reorden DECIMAL(10, 2),
    FOREIGN KEY (categoria_id) REFERENCES CategoriasProductosReventa(id),
    FOREIGN KEY (proveedor_preferido_id) REFERENCES Proveedores(id),
    FOREIGN KEY (unidad_base_inventario_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (unidad_venta_id) REFERENCES UnidadesDeMedida(id)
);

-- Back to Compras App details (needs MateriasPrimas and ProductosReventa)
CREATE TABLE DetalleOrdenesCompra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_compra_id INTEGER NOT NULL,
    materia_prima_id INTEGER,
    producto_reventa_id INTEGER,
    cantidad_solicitada DECIMAL(10, 2) DEFAULT 0,
    cantidad_recibida DECIMAL(10, 2) DEFAULT 0,
    unidad_medida_compra_id INTEGER NOT NULL,
    costo_unitario_usd DECIMAL(10, 2) DEFAULT 0,
    subtotal_linea_usd DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (orden_compra_id) REFERENCES OrdenesCompra(id),
    FOREIGN KEY (materia_prima_id) REFERENCES MateriasPrimas(id),
    FOREIGN KEY (producto_reventa_id) REFERENCES ProductosReventa(id),
    FOREIGN KEY (unidad_medida_compra_id) REFERENCES UnidadesDeMedida(id),
    CHECK (
        (materia_prima_id IS NOT NULL AND producto_reventa_id IS NULL) OR
        (materia_prima_id IS NULL AND producto_reventa_id IS NOT NULL)
    )
);

CREATE TABLE DetalleCompras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    compra_id INTEGER NOT NULL,
    detalle_oc_id INTEGER NOT NULL,
    materia_prima_id INTEGER,
    producto_reventa_id INTEGER,
    cantidad_recibida DECIMAL(10, 2) NOT NULL,
    unidad_medida_id INTEGER NOT NULL,
    costo_unitario_usd DECIMAL(10, 2) NOT NULL,
    subtotal_usd DECIMAL(10, 2) NOT NULL,
    notas TEXT,
    FOREIGN KEY (compra_id) REFERENCES Compras(id),
    FOREIGN KEY (detalle_oc_id) REFERENCES DetalleOrdenesCompra(id),
    FOREIGN KEY (materia_prima_id) REFERENCES MateriasPrimas(id),
    FOREIGN KEY (producto_reventa_id) REFERENCES ProductosReventa(id),
    FOREIGN KEY (unidad_medida_id) REFERENCES UnidadesDeMedida(id),
    CHECK (
        (materia_prima_id IS NOT NULL AND producto_reventa_id IS NULL) OR
        (materia_prima_id IS NULL AND producto_reventa_id IS NOT NULL)
    )
);

-- Inventario Lotes (needs DetalleOrdenesCompra)
CREATE TABLE LotesMateriasPrimas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    materia_prima_id INTEGER NOT NULL,
    proveedor_id INTEGER,
    fecha_recepcion DATE NOT NULL,
    fecha_caducidad DATE NOT NULL,
    cantidad_recibida DECIMAL(10, 2) NOT NULL,
    stock_actual_lote DECIMAL(10, 2) NOT NULL,
    costo_unitario_usd DECIMAL(10, 2) NOT NULL,
    detalle_oc_id INTEGER,
    estado VARCHAR(10) DEFAULT 'DISPONIBLE',
    activo BOOLEAN DEFAULT 1,
    FOREIGN KEY (materia_prima_id) REFERENCES MateriasPrimas(id),
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id),
    FOREIGN KEY (detalle_oc_id) REFERENCES DetalleOrdenesCompra(id)
);

CREATE TABLE LotesProductosReventa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_reventa_id INTEGER NOT NULL,
    fecha_recepcion DATE NOT NULL,
    fecha_caducidad DATE NOT NULL,
    cantidad_recibida DECIMAL(10, 2) DEFAULT 0,
    stock_actual_lote DECIMAL(10, 2) DEFAULT 0,
    coste_unitario_lote_usd DECIMAL(10, 2) DEFAULT 0,
    detalle_oc_id INTEGER,
    proveedor_id INTEGER,
    estado VARCHAR(10) DEFAULT 'DISPONIBLE',
    FOREIGN KEY (producto_reventa_id) REFERENCES ProductosReventa(id),
    FOREIGN KEY (detalle_oc_id) REFERENCES DetalleOrdenesCompra(id),
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id)
);

-- Produccion App
CREATE TABLE Produccion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_elaborado_id INTEGER NOT NULL,
    cantidad_producida DECIMAL(10, 3) NOT NULL,
    fecha_produccion DATE DEFAULT CURRENT_DATE,
    fecha_expiracion DATE,
    costo_total_componentes_usd DECIMAL(10, 3),
    usuario_creacion_id INTEGER NOT NULL,
    unidad_medida_id INTEGER,
    FOREIGN KEY (producto_elaborado_id) REFERENCES ProductosElaborados(id),
    FOREIGN KEY (usuario_creacion_id) REFERENCES Users(id),
    FOREIGN KEY (unidad_medida_id) REFERENCES UnidadesDeMedida(id)
);

CREATE TABLE LotesProductosElaborados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    FOREIGN KEY (produccion_origen_id) REFERENCES Produccion(id),
    FOREIGN KEY (producto_elaborado_id) REFERENCES ProductosElaborados(id)
);

CREATE TABLE Recetas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255),
    producto_elaborado_id INTEGER UNIQUE,
    fecha_creacion DATETIME,
    fecha_modificacion DATETIME,
    notas TEXT,
    FOREIGN KEY (producto_elaborado_id) REFERENCES ProductosElaborados(id)
);

CREATE TABLE RecetasDetalles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receta_id INTEGER,
    componente_materia_prima_id INTEGER,
    componente_producto_intermedio_id INTEGER,
    cantidad DECIMAL(10, 3) DEFAULT 0,
    FOREIGN KEY (receta_id) REFERENCES Recetas(id),
    FOREIGN KEY (componente_materia_prima_id) REFERENCES MateriasPrimas(id),
    FOREIGN KEY (componente_producto_intermedio_id) REFERENCES ProductosElaborados(id),
    CHECK (
        (componente_materia_prima_id IS NOT NULL AND componente_producto_intermedio_id IS NULL) OR
        (componente_materia_prima_id IS NULL AND componente_producto_intermedio_id IS NOT NULL)
    )
);

CREATE TABLE RelacionesRecetas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receta_principal_id INTEGER NOT NULL,
    subreceta_id INTEGER NOT NULL,
    FOREIGN KEY (receta_principal_id) REFERENCES Recetas(id),
    FOREIGN KEY (subreceta_id) REFERENCES Recetas(id)
);

CREATE TABLE DetalleProduccionCosumos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produccion_id INTEGER NOT NULL,
    materia_prima_consumida_id INTEGER,
    producto_intermedio_consumido_id INTEGER,
    cantidad_consumida DECIMAL(10, 3) NOT NULL,
    costo_consumo_usd DECIMAL(10, 3) DEFAULT 0,
    FOREIGN KEY (produccion_id) REFERENCES Produccion(id),
    FOREIGN KEY (materia_prima_consumida_id) REFERENCES MateriasPrimas(id),
    FOREIGN KEY (producto_intermedio_consumido_id) REFERENCES ProductosElaborados(id),
    CHECK (
        (materia_prima_consumida_id IS NOT NULL AND producto_intermedio_consumido_id IS NULL) OR
        (materia_prima_consumida_id IS NULL AND producto_intermedio_consumido_id IS NOT NULL)
    )
);

CREATE TABLE DetalleProduccionLote (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    detalle_produccion_id INTEGER NOT NULL,
    lote_materia_prima_id INTEGER,
    lote_producto_intermedio_id INTEGER,
    cantidad_consumida DECIMAL(10, 3) NOT NULL,
    costo_parcial_usd DECIMAL(10, 3) DEFAULT 0,
    FOREIGN KEY (detalle_produccion_id) REFERENCES DetalleProduccionCosumos(id),
    FOREIGN KEY (lote_materia_prima_id) REFERENCES LotesMateriasPrimas(id),
    FOREIGN KEY (lote_producto_intermedio_id) REFERENCES LotesProductosElaborados(id),
    CHECK (
        (lote_materia_prima_id IS NOT NULL AND lote_producto_intermedio_id IS NULL) OR
        (lote_materia_prima_id IS NULL AND lote_producto_intermedio_id IS NOT NULL)
    )
);

CREATE TABLE DefinicionTransformacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255) NOT NULL,
    producto_elaborado_entrada_id INTEGER NOT NULL,
    cantidad_entrada DECIMAL(10, 2) DEFAULT 0,
    unidad_medida_entrada_id INTEGER NOT NULL,
    producto_elaborado_salida_id INTEGER NOT NULL,
    unidad_medida_salida_id INTEGER NOT NULL,
    cantidad_salida DECIMAL(10, 2) DEFAULT 0,
    usuario_creacion_id INTEGER NOT NULL,
    fecha_creacion DATETIME NOT NULL,
    activo BOOLEAN DEFAULT 0,
    FOREIGN KEY (producto_elaborado_entrada_id) REFERENCES ProductosElaborados(id),
    FOREIGN KEY (unidad_medida_entrada_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (producto_elaborado_salida_id) REFERENCES ProductosElaborados(id),
    FOREIGN KEY (unidad_medida_salida_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (usuario_creacion_id) REFERENCES Users(id)
);

CREATE TABLE LogTransformacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    definicion_transformacion_id INTEGER NOT NULL,
    cantidad_producto_entrada_efectiva DECIMAL(10, 2) DEFAULT 0,
    cantidad_producto_salida_total_generado DECIMAL(10, 2) DEFAULT 0,
    costo_unitario_entrada_usd DECIMAL(10, 2) DEFAULT 0,
    costo_total_entrada_calculado_usd DECIMAL(10, 2) DEFAULT 0,
    costo_unitario_salida_calculado_usd DECIMAL(10, 2) DEFAULT 0,
    usuario_creacion_id INTEGER NOT NULL,
    fecha_creacion DATETIME NOT NULL,
    notas TEXT,
    FOREIGN KEY (definicion_transformacion_id) REFERENCES DefinicionTransformacion(id),
    FOREIGN KEY (usuario_creacion_id) REFERENCES Users(id)
);

-- Apps Transformacion
CREATE TABLE Transformacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_transformacion VARCHAR(255) NOT NULL,
    cantidad_origen DECIMAL(10, 3) NOT NULL,
    cantidad_destino DECIMAL(10, 3) NOT NULL,
    fecha_creacion DATETIME NOT NULL,
    activo BOOLEAN DEFAULT 1
);

CREATE TABLE EjecutarTransformacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transformacion_id INTEGER NOT NULL,
    producto_origen_id INTEGER NOT NULL,
    producto_destino_id INTEGER NOT NULL,
    fecha_ejecucion DATETIME NOT NULL,
    FOREIGN KEY (transformacion_id) REFERENCES Transformacion(id),
    FOREIGN KEY (producto_origen_id) REFERENCES ProductosElaborados(id),
    FOREIGN KEY (producto_destino_id) REFERENCES ProductosElaborados(id)
);

-- Ventas App
CREATE TABLE Clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_cliente VARCHAR(100) NOT NULL,
    apellido_cliente VARCHAR(100) NOT NULL,
    telefono VARCHAR(100),
    email VARCHAR(100),
    rif_cedula VARCHAR(100),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    notas TEXT
);

CREATE TABLE AperturaCierreCaja (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_apertura_id INTEGER NOT NULL,
    monto_inicial_usd DECIMAL(10, 2),
    monto_inicial_ves DECIMAL(10, 2),
    fecha_apertura DATETIME NOT NULL,
    fecha_cierre DATETIME,
    usuario_cierre_id INTEGER,
    monto_final_usd DECIMAL(10, 2),
    monto_final_ves DECIMAL(10, 2),
    
    total_efectivo_usd DECIMAL(10, 2),
    total_efectivo_ves DECIMAL(10, 2),
    total_tarjeta_usd DECIMAL(10, 2),
    total_tarjeta_ves DECIMAL(10, 2),
    total_transferencia_usd DECIMAL(10, 2),
    total_transferencia_ves DECIMAL(10, 2),
    total_pago_movil_usd DECIMAL(10, 2),
    total_pago_movil_ves DECIMAL(10, 2),
    
    total_cambio_efectivo_usd DECIMAL(10, 2),
    total_cambio_efectivo_ves DECIMAL(10, 2),
    total_cambio_pago_movil_usd DECIMAL(10, 2),
    total_cambio_pago_movil_ves DECIMAL(10, 2),
    
    total_cambio_usd DECIMAL(10, 2),
    total_cambio_ves DECIMAL(10, 2),
    total_ventas_usd DECIMAL(10, 2),
    total_ventas_ves DECIMAL(10, 2),
    
    diferencia_usd DECIMAL(10, 2),
    diferencia_ves DECIMAL(10, 2),
    notas_apertura TEXT,
    notas_cierre TEXT,
    esta_activa BOOLEAN DEFAULT 1,
    FOREIGN KEY (usuario_apertura_id) REFERENCES Users(id),
    FOREIGN KEY (usuario_cierre_id) REFERENCES Users(id)
);

CREATE TABLE Ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    usuario_cajero_id INTEGER NOT NULL,
    fecha_venta DATE NOT NULL,
    monto_total_usd DECIMAL(10, 2) NOT NULL,
    monto_total_ves DECIMAL(10, 2) NOT NULL,
    tasa_cambio_aplicada DECIMAL(10, 2) NOT NULL,
    notas TEXT,
    apertura_caja_id INTEGER,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id),
    FOREIGN KEY (usuario_cajero_id) REFERENCES Users(id),
    FOREIGN KEY (apertura_caja_id) REFERENCES AperturaCierreCaja(id)
);

CREATE TABLE DetalleVenta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venta_id INTEGER NOT NULL,
    producto_elaborado_id INTEGER,
    producto_reventa_id INTEGER,
    unidad_medida_venta_id INTEGER NOT NULL,
    cantidad_vendida DECIMAL(10, 2) NOT NULL,
    precio_unitario_usd DECIMAL(10, 2) DEFAULT 0,
    precio_unitario_ves DECIMAL(10, 2) DEFAULT 0,
    subtotal_linea_usd DECIMAL(10, 2) DEFAULT 0,
    subtotal_linea_ves DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (venta_id) REFERENCES Ventas(id),
    FOREIGN KEY (producto_elaborado_id) REFERENCES ProductosElaborados(id),
    FOREIGN KEY (producto_reventa_id) REFERENCES ProductosReventa(id),
    FOREIGN KEY (unidad_medida_venta_id) REFERENCES UnidadesDeMedida(id),
    CHECK (
        (producto_elaborado_id IS NOT NULL AND producto_reventa_id IS NULL) OR
        (producto_elaborado_id IS NULL AND producto_reventa_id IS NOT NULL)
    )
);

CREATE TABLE VentasLotesVendidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    detalle_venta_asociada_id INTEGER NOT NULL,
    lote_producto_elaborado_id INTEGER,
    lote_producto_reventa_id INTEGER,
    cantidad_consumida DECIMAL(10, 3) NOT NULL,
    fecha_consumo DATETIME NOT NULL,
    FOREIGN KEY (detalle_venta_asociada_id) REFERENCES DetalleVenta(id),
    FOREIGN KEY (lote_producto_elaborado_id) REFERENCES LotesProductosElaborados(id),
    FOREIGN KEY (lote_producto_reventa_id) REFERENCES LotesProductosReventa(id),
    CHECK (
        (lote_producto_elaborado_id IS NOT NULL AND lote_producto_reventa_id IS NULL) OR
        (lote_producto_elaborado_id IS NULL AND lote_producto_reventa_id IS NOT NULL)
    )
);

CREATE TABLE OrdenVenta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    fecha_creacion_orden DATE NOT NULL,
    fecha_entrega_solicitada DATE NOT NULL,
    fecha_entrega_definitiva DATE,
    usuario_creador_id INTEGER NOT NULL,
    notas_generales TEXT,
    monto_descuento_usd DECIMAL(10, 3) DEFAULT 0,
    monto_impuestos_usd DECIMAL(10, 3) DEFAULT 0,
    monto_total_usd DECIMAL(10, 3) NOT NULL,
    monto_total_ves DECIMAL(10, 3) NOT NULL,
    tasa_cambio_aplicada DECIMAL(10, 3) NOT NULL,
    estado_orden_id INTEGER NOT NULL,
    metodo_pago_id INTEGER,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id),
    FOREIGN KEY (usuario_creador_id) REFERENCES Users(id),
    FOREIGN KEY (estado_orden_id) REFERENCES EstadosOrdenVenta(id),
    FOREIGN KEY (metodo_pago_id) REFERENCES MetodosDePago(id)
);

CREATE TABLE DetallesOrdenVenta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_venta_asociada_id INTEGER NOT NULL,
    producto_elaborado_id INTEGER,
    producto_reventa_id INTEGER,
    cantidad_solicitada DECIMAL(10, 3) NOT NULL,
    unidad_medida_id INTEGER NOT NULL,
    precio_unitario_usd DECIMAL(10, 3) NOT NULL,
    subtotal_linea_usd DECIMAL(10, 3) NOT NULL,
    descuento_porcentaje DECIMAL(10, 3),
    impuesto_porcentaje DECIMAL(10, 3),
    FOREIGN KEY (orden_venta_asociada_id) REFERENCES OrdenVenta(id),
    FOREIGN KEY (producto_elaborado_id) REFERENCES ProductosElaborados(id),
    FOREIGN KEY (producto_reventa_id) REFERENCES ProductosReventa(id),
    FOREIGN KEY (unidad_medida_id) REFERENCES UnidadesDeMedida(id),
    CHECK (
        (producto_elaborado_id IS NOT NULL AND producto_reventa_id IS NULL) OR
        (producto_elaborado_id IS NULL AND producto_reventa_id IS NOT NULL)
    )
);

CREATE TABLE OrdenConsumoLote (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_venta_asociada_id INTEGER NOT NULL,
    detalle_orden_venta_id INTEGER NOT NULL,
    fecha_registro DATETIME NOT NULL,
    FOREIGN KEY (orden_venta_asociada_id) REFERENCES OrdenVenta(id),
    FOREIGN KEY (detalle_orden_venta_id) REFERENCES DetallesOrdenVenta(id)
);

CREATE TABLE OrdenConsumoLoteDetalle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_consumo_lote_id INTEGER NOT NULL,
    lote_producto_elaborado_id INTEGER,
    lote_producto_reventa_id INTEGER,
    cantidad_consumida DECIMAL(10, 3) NOT NULL,
    costo_parcial_usd DECIMAL(10, 3) DEFAULT 0,
    FOREIGN KEY (orden_consumo_lote_id) REFERENCES OrdenConsumoLote(id),
    FOREIGN KEY (lote_producto_elaborado_id) REFERENCES LotesProductosElaborados(id),
    FOREIGN KEY (lote_producto_reventa_id) REFERENCES LotesProductosReventa(id),
    CHECK (
        (lote_producto_elaborado_id IS NOT NULL AND lote_producto_reventa_id IS NULL) OR
        (lote_producto_elaborado_id IS NULL AND lote_producto_reventa_id IS NOT NULL)
    )
);

CREATE TABLE Pagos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venta_asociada_id INTEGER,
    orden_venta_asociada_id INTEGER,
    metodo_pago_id INTEGER NOT NULL,
    monto_pago_usd DECIMAL(10, 2) NOT NULL,
    monto_pago_ves DECIMAL(10, 2) NOT NULL,
    fecha_pago DATE NOT NULL,
    referencia_pago VARCHAR(100),
    cambio_efectivo_usd DECIMAL(10, 2),
    cambio_efectivo_ves DECIMAL(10, 2),
    cambio_pago_movil_usd DECIMAL(10, 2),
    cambio_pago_movil_ves DECIMAL(10, 2),
    usuario_registrador_id INTEGER NOT NULL,
    tasa_cambio_aplicada DECIMAL(10, 2) NOT NULL,
    notas TEXT,
    FOREIGN KEY (venta_asociada_id) REFERENCES Ventas(id),
    FOREIGN KEY (orden_venta_asociada_id) REFERENCES OrdenVenta(id),
    FOREIGN KEY (metodo_pago_id) REFERENCES MetodosDePago(id),
    FOREIGN KEY (usuario_registrador_id) REFERENCES Users(id),
    CHECK (
        (venta_asociada_id IS NOT NULL AND orden_venta_asociada_id IS NULL) OR
        (venta_asociada_id IS NULL AND orden_venta_asociada_id IS NOT NULL)
    )
);