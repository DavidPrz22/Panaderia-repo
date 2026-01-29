-- Ventas App

CREATE TABLE Clientes (
    id SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    apellido_cliente VARCHAR(100) NOT NULL,
    telefono VARCHAR(100),
    email VARCHAR(100),
    rif_cedula VARCHAR(100),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    notas TEXT
);

CREATE TABLE AperturaCierreCaja (
    id SERIAL PRIMARY KEY,
    usuario_apertura_id INTEGER NOT NULL,
    monto_inicial_usd DECIMAL(10, 2),
    monto_inicial_ves DECIMAL(10, 2),
    fecha_apertura TIMESTAMP NOT NULL,
    fecha_cierre TIMESTAMP,
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
    esta_activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_apertura_id) REFERENCES Users(id),
    FOREIGN KEY (usuario_cierre_id) REFERENCES Users(id)
);

CREATE TABLE Ventas (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
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
    CONSTRAINT detalle_venta_un_solo_tipo_de_producto CHECK (
        (producto_elaborado_id IS NOT NULL AND producto_reventa_id IS NULL) OR
        (producto_elaborado_id IS NULL AND producto_reventa_id IS NOT NULL)
    )
);

CREATE TABLE VentasLotesVendidos (
    id SERIAL PRIMARY KEY,
    detalle_venta_asociada_id INTEGER NOT NULL,
    lote_producto_elaborado_id INTEGER,
    lote_producto_reventa_id INTEGER,
    cantidad_consumida DECIMAL(10, 3) NOT NULL,
    fecha_consumo TIMESTAMP NOT NULL,
    FOREIGN KEY (detalle_venta_asociada_id) REFERENCES DetalleVenta(id),
    FOREIGN KEY (lote_producto_elaborado_id) REFERENCES LotesProductosElaborados(id),
    FOREIGN KEY (lote_producto_reventa_id) REFERENCES LotesProductosReventa(id),
    CONSTRAINT venta_lotes_vendidos_un_solo_tipo CHECK (
        (lote_producto_elaborado_id IS NOT NULL AND lote_producto_reventa_id IS NULL) OR
        (lote_producto_elaborado_id IS NULL AND lote_producto_reventa_id IS NOT NULL)
    )
);

CREATE TABLE OrdenVenta (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
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
    CONSTRAINT detalle_orden_venta_un_solo_tipo_de_producto CHECK (
        (producto_elaborado_id IS NOT NULL AND producto_reventa_id IS NULL) OR
        (producto_elaborado_id IS NULL AND producto_reventa_id IS NOT NULL)
    )
);

CREATE TABLE OrdenConsumoLote (
    id SERIAL PRIMARY KEY,
    orden_venta_asociada_id INTEGER NOT NULL,
    detalle_orden_venta_id INTEGER NOT NULL,
    fecha_registro TIMESTAMP NOT NULL,
    FOREIGN KEY (orden_venta_asociada_id) REFERENCES OrdenVenta(id),
    FOREIGN KEY (detalle_orden_venta_id) REFERENCES DetallesOrdenVenta(id)
);

CREATE TABLE OrdenConsumoLoteDetalle (
    id SERIAL PRIMARY KEY,
    orden_consumo_lote_id INTEGER NOT NULL,
    lote_producto_elaborado_id INTEGER,
    lote_producto_reventa_id INTEGER,
    cantidad_consumida DECIMAL(10, 3) NOT NULL,
    costo_parcial_usd DECIMAL(10, 3) DEFAULT 0,
    FOREIGN KEY (orden_consumo_lote_id) REFERENCES OrdenConsumoLote(id),
    FOREIGN KEY (lote_producto_elaborado_id) REFERENCES LotesProductosElaborados(id),
    FOREIGN KEY (lote_producto_reventa_id) REFERENCES LotesProductosReventa(id),
    CONSTRAINT detalle_orden_consumo_lote_un_solo_tipo_de_producto CHECK (
        (lote_producto_elaborado_id IS NOT NULL AND lote_producto_reventa_id IS NULL) OR
        (lote_producto_elaborado_id IS NULL AND lote_producto_reventa_id IS NOT NULL)
    )
);

CREATE TABLE Pagos (
    id SERIAL PRIMARY KEY,
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
    CONSTRAINT un_solo_tipo_de_venta_por_pago CHECK (
        (venta_asociada_id IS NOT NULL AND orden_venta_asociada_id IS NULL) OR
        (venta_asociada_id IS NULL AND orden_venta_asociada_id IS NOT NULL)
    )
);
