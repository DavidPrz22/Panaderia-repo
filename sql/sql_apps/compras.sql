-- Compras App

CREATE TABLE Proveedores (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
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
    email_enviado BOOLEAN DEFAULT FALSE,
    fecha_email_enviado TIMESTAMP,
    terminos_pago VARCHAR(100),
    notas TEXT,
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id),
    FOREIGN KEY (usuario_creador_id) REFERENCES Users(id),
    FOREIGN KEY (estado_oc_id) REFERENCES EstadosOrdenCompra(id),
    FOREIGN KEY (metodo_pago_id) REFERENCES MetodosDePago(id)
);

CREATE TABLE Compras (
    id SERIAL PRIMARY KEY,
    orden_compra_id INTEGER NOT NULL,
    proveedor_id INTEGER NOT NULL,
    usuario_recepcionador_id INTEGER NOT NULL,
    pagado BOOLEAN DEFAULT FALSE,
    monto_pendiente_pago_usd DECIMAL(10, 2) DEFAULT 0,
    fecha_recepcion DATE NOT NULL,
    numero_factura_proveedor VARCHAR(100),
    numero_remision VARCHAR(100),
    monto_recepcion_usd DECIMAL(10, 2) DEFAULT 0,
    monto_recepcion_ves DECIMAL(10, 2) DEFAULT 0,
    tasa_cambio_aplicada DECIMAL(10, 2) DEFAULT 0,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (orden_compra_id) REFERENCES OrdenesCompra(id),
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id),
    FOREIGN KEY (usuario_recepcionador_id) REFERENCES Users(id)
);

CREATE TABLE PagosProveedores (
    id SERIAL PRIMARY KEY,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (compra_asociada_id) REFERENCES Compras(id),
    FOREIGN KEY (orden_compra_asociada_id) REFERENCES OrdenesCompra(id),
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id),
    FOREIGN KEY (metodo_pago_id) REFERENCES MetodosDePago(id),
    FOREIGN KEY (usuario_registrador_id) REFERENCES Users(id)
);

CREATE TABLE DetalleOrdenesCompra (
    id SERIAL PRIMARY KEY,
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
    CONSTRAINT detalle_orden_compra_un_solo_tipo_de_producto CHECK (
        (materia_prima_id IS NOT NULL AND producto_reventa_id IS NULL) OR
        (materia_prima_id IS NULL AND producto_reventa_id IS NOT NULL)
    )
);

CREATE TABLE DetalleCompras (
    id SERIAL PRIMARY KEY,
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
    CONSTRAINT detalle_compra_un_solo_tipo_de_producto CHECK (
        (materia_prima_id IS NOT NULL AND producto_reventa_id IS NULL) OR
        (materia_prima_id IS NULL AND producto_reventa_id IS NOT NULL)
    )
);
