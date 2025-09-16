-- Tabla de materias primas (items que se utilizan para crear )


TABLE MateriasPrimas(
    id_materia_prima INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE, -- Nombre de la materia prima (ej: Harina de trigo).
    id_unidad_medida_base INTEGER NOT NULL -- Unidad de medida (ej: kg, gr, lt, ml, unidad).
    stock_actual REAL NOT NULL DEFAULT 0, -- Cantidad actual en inventario.
    nombre_empaque_estandar TEXT -- Botella, Saco, Garrafa, Contenedor
    SKU TEXT UNIQUE, -- Stock Keeping Unit
    cantidad_por_empaque_estandar REAL, -- (ej: 1000 si unidad_medida es "ml"; 25 si unidad_medida es "kg")
    id_unidad_medida_empaque INTEGER NOT NULL, -- Unidad de medida usada para el empaque
    description TEXT, -- Descripción adicional.
    punto_reorden REAL, -- Punto en el que se debe de comprar materia prima
    fecha_ultima_actualizacion_stock DATETIME NOT NULL, -- Fecha de la última modificación del stock.
    categoria_id INTEGER, -- categoria al que pertenece
    fecha_creacion_registro DATETIME NOT NULL DEFAULT TIMESTAMP,
    fecha_modificacion_registro DATETIME NOT NULL DEFAULT TIMESTAMP,
    FOREIGN KEY categoria_id REFERENCES CategoriasMateriaPrima(id_categoria),
    FOREIGN KEY id_unidad_medida_base REFERENCES UnidadesDeMedida(id_unidad_medida)
    FOREIGN KEY id_unidad_medida_empaque REFERENCES UnidadesDeMedida(id_unidad_medida)
)


TABLE CategoriasMateriaPrima (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,	-- Identificador único de la categoría.
    nombre_categoria TEXT NOT NULL UNIQUE,	--Nombre de la categoría (ej: Lácteos, Harinas, Secos, Empaques).
    descripcion TEXT  -- Descripción adicional de la categoría.
)


TABLE UnidadesDeMedida (
    id_unidad_medida INT PRIMARY KEY AUTOINCREMENT	-- Identificador numérico único para la unidad de medida.
    abreviatura	TEXT NOT NULL, UNIQUE -- Abreviatura estándar de la unidad (ej: "kg", "gr", "lt", "ml", "un", "oz").
    nombre_completo	TEXT	NOT NULL -- Nombre completo de la unidad (ej: "Kilogramo", "Gramo", "Litro", "Unidad").
    tipo_medida	TEXT NULL -- Tipo de medida (ej: "Peso", "Volumen", "Cantidad", "Longitud").
    descripcion TEXT NULL -- Descripción adicional o notas sobre la unidad.
    activo BOOLEAN NOT NULL -- Para desactivar unidades que ya no se usen sin borrarlas.
)


TABLE LotesMateriaPrima (
    id_lote INTEGER PRIMARY KEY, -- Identificador único del lote.
    id_materia_prima INTEGER NOT NULL, -- Materia prima a la que pertenece este lote.
    id_proveedor INTEGER, -- id del proveedor (opcional, para trazabilidad).
    fecha_recepcion DATETIME NOT NULL, -- Fecha en que se recibió este lote.
    fecha_caducidad DATETIME NOT NULL, -- Fecha de caducidad específica de este lote.
    cantidad_recibida INTEGER NOT NULL, -- Cantidad original recibida en este lote (en unidad_medida de MateriasPrimas).
    stock_actual_lote REAL NOT NULL, -- Cantidad restante de este lote específico.
    costo_unitario_lote_usd REAL, -- Costo unitario de la materia prima para este lote específico.
    id_detalle_oc INTEGER, -- (Opcional) Enlace a la orden de compra si tienes un módulo de compras.
    activo BOOLEAN, -- Indica si el lote todavía tiene stock o ya se consumió/descartó.
    FOREIGN KEY id_materia_prima REFERENCES MateriasPrimas(id_materia_prima),
    FOREIGN KEY id_proveedor REFERENCES Proveedores(id_proveedor),
    FOREIGN KEY id_detalle_oc REFERENCES DetallesOrdenCompra(id_detalle_oc),
)


TABLE ProductosElaborados(
    id_producto_elaborado INTEGER PRIMARY KEY AUTOINCREMENT. -- Identificador único del producto elaborado.
    nombre TEXT NOT NULL UNIQUE, -- Nombre del producto (ej: Pan Campesino).
    description TEXT, -- Descripción adicional.
    tipo_manejo_venta TEXT NOT NULL CHECK (tipo_manejo_venta IN ('UNIDAD', 'PESO_VOLUMEN')),
    unidad_nominal_venta REAL NULL, -- Peso nominal o estándar del producto si se vende como una unidad contable.
                            -- Por ejemplo, una "Torta Entera" (vendida por 'Unidad') puede tener un peso_nominal de 1.5 (kg).
    id_unidad_medida_nominal INTEGER NULL, -- FK a UnidadesDeMedida. Unidad del peso_nominal (ej: 'kg', 'gr').
    precio_venta_usd REAL, -- Precio de venta al público.
    punto_reorden INTEGER,
    stock_actual REAL NOT NULL DEFAULT 0, -- Cantidad actual de productos terminados.
    categoria_id INTEGER, -- categoria al que pertenece
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Actualizar con trigger
    es_intermediario BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY categoria_id REFERENCES CategoriasProductosElaborados(id_categoria),
    FOREIGN KEY id_unidad_medida_nominal REFERENCES UnidadesDeMedida(id_unidad_medida),
    CHECK (
        (es_intermediario IS TRUE AND punto_reorden IS NULL) OR
        (es_intermediario IS FALSE AND punto_reorden IS NOT NULL)
    )
)


TABLE LotesProductosElaborados (
    id_lote_producto_elaborado INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produccion_origen INTEGER NOT NULL,      -- FK a Produccion(id_produccion). Identifica el evento que creó este lote.
    id_producto_elaborado INTEGER NOT NULL,       -- FK a ProductosElaborados(id_producto_elaborado).
    
    cantidad_inicial_lote REAL NOT NULL,        -- Cantidad original producida en este lote (copiada de Produccion.cantidad_producida).
    stock_actual_lote REAL NOT NULL,            -- Cantidad restante de este lote específico.
    
    fecha_produccion DATETIME NOT NULL,           -- Fecha de producción (copiada de Produccion.fecha_produccion).
    fecha_caducidad_lote DATETIME NULL,         -- Fecha de caducidad específica para este lote. (Calculada: fecha_produccion + vida_util).
                                                -- La vida útil podría ser un atributo en la tabla ProductosElaborados.
                                                
    costo_unitario_lote_usd REAL NOT NULL,      -- Costo unitario de producción para este lote (copiado de Produccion.costo_por_unidad_producto_usd).
    
    activo BOOLEAN NOT NULL DEFAULT TRUE,       -- Indica si el lote todavía tiene stock y está disponible para venta/consumo.
                                                -- Se puede poner en FALSE cuando stock_actual_lote sea 0 o el lote expire/se descarte.
    notas TEXT NULL,                            -- Notas específicas del lote.

    FOREIGN KEY (id_produccion_origen) REFERENCES Produccion(id_produccion),
    FOREIGN KEY (id_producto_elaborado) REFERENCES ProductosElaborados(id_producto_elaborado)
)


TABLE CategoriasProductosElaborados (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_categoria TEXT NOT NULL UNIQUE, 
    -- Panes (Salados, Dulces, Especiales)
    -- Pastelería (Dulces individuales, croissants, palmeritas)
    -- Tortas (Completas, por porción)
    -- Postres (Flanes, gelatinas, mousses)
    -- Bebidas (Jugos, cafés)
    -- Pasapalos/Bocadillos
    descripcion TEXT,
)


TABLE ProductosReventa (
    id_producto_reventa (INTEGER PRIMARY KEY AUTOINCREMENT),
    nombre TEXT NOT NULL UNIQUE, -- Ej: "Refresco de Cola Lata 355ml", "Jamón Cocido Superior", "Queso Gouda Pieza".
    descripcion TEXT,
    id_categoria_pr INTEGER NULL, -- FK a CategoriasProductoReventa - Categoría del producto de reventa.
    marca TEXT,
    SKU TEXT UNIQUE, -- Stock Keeping Unit
    id_proveedor_preferido INTEGER NULL, -- FK a Proveedor
    tipo_manejo_venta TEXT NOT NULL CHECK (tipo_manejo_venta IN ('UNIDAD', 'PESO_VOLUMEN')), -- Indica si se vende por unidad fija o por peso/volumen.
    id_unidad_base_inventario INTEGER NOT NULL, -- Unidad en la que se gestiona el stock (ej: "Unidad" para latas, "Gramos" para jamón).
    stock_actual REAL NOT NULL DEFAULT 0, -- Stock total en id_unidad_base_inventario.
    precio_venta_usd REAL NOT NULL, -- Si tipo_manejo_venta es 'UNIDAD', es precio/unidad. Si es 'PESO_VOLUMEN', es precio/id_unidad_base_inventario (ej. precio por gramo).
    costo_ultima_compra_unitario_usd REAL NULL, -- Costo por id_unidad_base_inventario para productos no loteados o como referencia.
    perecedero BOOLEAN NOT NULL, -- Indica si requiere gestión de lotes por caducidad.
    activo BOOLEAN NOT NULL,
    fecha_creacion_registro DATETIME NOT NULL,
    fecha_modificacion_registro DATETIME NOT NULL,
    FOREIGN KEY id_proveedor_preferido REFERENCES Proveedor(id_proveedor),
    FOREIGN KEY id_unidad_base_inventario REFERENCES UnidadesDeMedida(id_unidad_medida),
    FOREIGN KEY id_categoria_pr REFERENCES CategoriasProductoReventa(id_categoria_pr),
)


TABLE LotesProductosReventa (
    id_lote_producto_reventa INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto_reventa INTEGER NOT NULL, -- FK a ProductosReventa
    fecha_recepcion DATETIME NOT NULL,
    fecha_caducidad DATETIME NULL, -- Esencial para FEFO.
    cantidad_recibida REAL NOT NULL, -- En la id_unidad_base_inventario del producto.
    stock_actual_lote REAL NOT NULL, -- En la id_unidad_base_inventario del producto.
    costo_unitario_lote_usd REAL NOT NULL, -- Costo por id_unidad_base_inventario para este lote.
    id_detalle_oc INTEGER NULL, -- Para enlazar al detalle de la orden de compra.
    id_proveedor INTEGER NULL, -- Proveedor de este lote específico.
    activo BOOLEAN NOT NULL DEFAULT TRUE -- Se puede poner en FALSE cuando el stock_actual_lote sea 0.
    FOREIGN KEY id_detalle_oc REFERENCES DetallesOrdenCompra(id_detalle_oc),
    FOREIGN KEY id_proveedor REFERENCES Proveedor(id_proveedor)
)


TABLE CategoriasProductoReventa (
    id_categoria_pr INTEGER PRIMARY KEY AUTOINCREMENT
    nombre_categoria TEXT NOT NULL UNIQUE -- Ej: "Bebidas", "Snacks Empaquetados", "Charcutería Nacional", "Lácteos".
    descripcion TEXT
    )


TABLE DefinicionTransformacion (
    id_definicion_transformacion INTEGER PRIMARY KEY AUTOINCREMENT -- Identificador único de la definición.
    nombre_transformacion TEXT NOT NULL -- Nombre descriptivo de la transformación (ej: "Torta Entera (Chocolate) a 8 Porciones").
    id_producto_entrada INTEGER NOT NULL -- FK a ProductosElaborados(id_producto_elaborado). El producto que se consume/transforma (ej: "Torta de Chocolate Entera").
    cantidad_entrada_base REAL NOT NULL DEFAULT 1 -- Cantidad del producto de entrada que define la base de la transformación (generalmente 1).
    id_unidad_medida_entrada INTEGER NOT NULL -- FK a UnidadesDeMedida(id_unidad_medida). Unidad del producto de entrada.
    id_producto_salida INTEGER NOT NULL -- FK a ProductosElaborados(id_producto_elaborado). El producto que se genera (ej: "Porción de Torta de Chocolate").
    cantidad_salida_generada_por_base REAL NOT NULL -- Cantidad del producto de salida que se obtiene a partir de la cantidad_entrada_base (ej: 8 porciones).
    id_unidad_medida_salida INTEGER NOT NULL -- FK a UnidadesDeMedida(id_unidad_medida). Unidad del producto de salida.
    descripcion TEXT NULL -- Descripción adicional de la definición de transformación.
    activo BOOLEAN NOT NULL DEFAULT TRUE -- Para poder desactivar una definición sin borrarla.
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    id_usuario_creador INTEGER NULL -- FK a Usuarios(id_usuario). Quién creó la definición.
    FOREIGN KEY (id_producto_entrada) REFERENCES ProductosElaborados(id_producto_elaborado),
    FOREIGN KEY (id_unidad_medida_entrada) REFERENCES UnidadesDeMedida(id_unidad_medida),
    FOREIGN KEY (id_producto_salida) REFERENCES ProductosElaborados(id_producto_elaborado),
    FOREIGN KEY (id_unidad_medida_salida) REFERENCES UnidadesDeMedida(id_unidad_medida),
    FOREIGN KEY (id_usuario_creador) REFERENCES Usuarios(id_usuario)
)

TABLE LogTransformaciones (
    id_log_transformacion INTEGER PRIMARY KEY AUTOINCREMENT -- Identificador único del evento de transformación.
    id_definicion_transformacion INTEGER NOT NULL -- FK a DefinicionTransformacion(id_definicion_transformacion). Indica qué "receta" de transformación se usó.
    cantidad_producto_entrada_efectiva REAL NOT NULL -- Cantidad del producto de entrada que realmente se transformó en este evento (ej: se transformaron 2 tortas enteras).
    cantidad_producto_salida_total_generado REAL NOT NULL -- Cantidad total del producto de salida generada en este evento (ej: si se transformaron 2 tortas y cada una produce 8 porciones, aquí sería 16).
    costo_unitario_entrada_usd REAL -- Costo unitario del producto de entrada en el momento de la transformación. Este es crucial para el costeo. (Se obtiene del inventario/producción del producto de entrada).
    costo_total_entrada_calculado_usd REAL -- Calculado: cantidad_producto_entrada_efectiva * costo_unitario_entrada_al_momento.
    costo_unitario_salida_calculado_usd REAL -- Calculado: costo_total_entrada_calculado / cantidad_producto_salida_total_generado. Este es el costo de cada unidad de porción generada.
    fecha_transformacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP -- Fecha y hora de la transformación.
    id_usuario_responsable INTEGER NOT NULL -- FK a Usuarios(id_usuario). Usuario que realizó la transformación.
    notas TEXT NULL -- Notas adicionales sobre esta transformación específica.
    FOREIGN KEY (id_definicion_transformacion) REFERENCES DefinicionTransformacion(id_definicion_transformacion),
    FOREIGN KEY (id_usuario_responsable) REFERENCES Usuarios(id_usuario)
)


-- Esta tabla define la lista de materiales (Bill of Materials - BOM) para cada producto elaborado.
TABLE Recetas (
    id_receta INTEGER PRIMARY KEY AUTOINCREMENT, -- Identificador único del detalle de la receta.
    id_producto_elaborado INTEGER NOT NULL, -- Producto al que pertenece esta línea de la receta.-- Materia prima utilizada en esta línea de la receta.
    -- cantidad_necesaria REAL NOT NULL, -- Cantidad de esta materia prima necesaria para una unidad del producto elaborado.
    id_componente_materia_prima  INTEGER NULL, -- FK materia prima
    id_componente_producto_intermedio INTEGER NULL, -- FK producto intermedio
    id_unidad_medida_receta INTEGER NOT NULL, -- Unidad de medida de la cantidad_necesaria (debe ser compatible con MateriasPrimas.unidad_medida).
    fecha_creacion_receta  DATETIME NOT NULL,
    FOREIGN KEY id_producto_elaborado REFERENCES ProductosElaborados(id_producto_elaborado),
    FOREIGN KEY id_componente_materia_prima REFERENCES MateriasPrimas(id_materia_prima),
    FOREIGN KEY id_unidad_medida_receta REFERENCES UnidadesDeMedida(id_unidad_medida),
    FOREIGN KEY id_componente_producto_intermedio REFERENCES ProductosElaborados(id_producto_elaborado),
    CHECK (
        (id_componente_materia_prima IS NOT NULL AND id_componente_producto_intermedio IS NULL) OR
        (id_componente_materia_prima IS NULL AND id_componente_producto_intermedio IS NOT NULL)
    )
)


TABLE Produccion (
    id_produccion INTEGER PRIMARY KEY AUTOINCREMENT, -- Identificador único del evento de producción.
    id_producto_elaborado INTEGER, -- Producto que se elaboró.
    cantidad_producida INTEGER, -- Número de unidades del producto que se elaboraron.
    fecha_produccion DATETIME, -- Fecha y hora en que se realizó la producción.
    costo_total_componentes_usd REAL, -- (Opcional) Costo total de las materias primas usadas.
    costo_por_unidad_producto_usd REAL, -- (Opcional) Costo por unidad de la materia primas usada.
    notas TEXT, -- Notas adicionales sobre la producción.
    id_usuario_responsable INTEGER NOT NULL,
    FOREIGN KEY id_usuario_responsable REFERENCES Usuarios(id_usuario),
    FOREIGN KEY id_producto_elaborado REFERENCES ProductosElaborados(id_producto_elaborado),
)


-- Registra el desglose exacto de materias primas consumidas por cada evento de producción.
TABLE DetalleProduccionConsumos (
    id_detalle_produccion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produccion INTEGER NOT NULL, -- Evento de producción al que pertenece este detalle.
    id_materia_prima_consumida INTEGER NULL, -- Materia prima consumida.
    id_lote_materia_prima_consumida INTEGER NULL,
    id_producto_intermedio_consumido INTEGER NULL, -- Producto Intermedio Consumido
    id_lote_producto_intermedio_consumido INTEGER NULL,
    cantidad_consumida NOT NULL, -- Cantidad exacta de esta materia prima que se descontó del inventario.
    id_unidad_medida_consumo INTEGER NOT NULL, -- Unidad en la que se midió el consumo (debería coincidir con MateriasPrimas.unidad_medida).
    costo_consumido REAL NULL, -- Costo de la materia prima consumida en este evento.
    FOREIGN KEY id_produccion REFERENCES Produccion(id_produccion),
    FOREIGN KEY id_materia_prima_consumida REFERENCES MateriasPrimas(id_materia_prima),
    FOREIGN KEY id_producto_intermedio_consumido REFERENCES ProductosElaborados(id_producto_elaborado),
    FOREIGN KEY id_lote_materia_prima_consumida REFERENCES LotesMateriaPrima(id_lote),
    FOREIGN KEY id_unidad_medida_consumo REFERENCES UnidadesDeMedida(id_unidad_medida),
    FOREIGN KEY id_lote_producto_intermedio_consumido REFERENCES LotesProductosElaborados(id_lote_producto_elaborado),
    CHECK (
        (id_materia_prima_consumida IS NOT NULL AND id_lote_materia_prima_consumida IS NOT NULL AND id_producto_intermedio_consumido IS NULL) OR
        (id_materia_prima_consumida IS NULL AND id_lote_materia_prima_consumida IS NULL AND id_producto_intermedio_consumido IS NOT NULL)
    )
)


TABLE Usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_completo_usuario TEXT NOT NULL,
    nombre_acceso_usuario TEXT NOT NULL UNIQUE,
    contrasena_hash TEXT NOT NULL,
    id_rol INTEGER,
    activo BOOLEAN,
    FOREIGN KEY id_rol REFERENCES Roles(id_rol)
)


TABLE Roles (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
    rol_nombre TEXT NOT NULL UNIQUE,
)


TABLE Clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_cliente TEXT NOT NULL,
    apellido_cliente,
    telefono TEXT UNIQUE,
    email TEXT UNIQUE,
    rif_cedula TEXT UNIQUE,
    fecha_registro DATETIME NOT NULL,
    notas_cliente TEXT,
)


TABLE EstadosOrden (
    id_estado_orden INTEGER PRIMARY KEY AUTOINCREMENT,
    nombe_estado TEXT NOT NULL UNIQUE, -- Ej: "Pendiente Confirmación", "Confirmado", "En Preparación", "Listo para Entrega/Retiro", "Entregado", "Cancelado", "Pago Pendiente"
    descripcion_estado TEXT,
    orden_flujo INTEGER,   -- Para ordenar los estados en un flujo lógico (ej. 1, 2, 3...)
)


TABLE Ventas (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_usuario_cajero INTEGER NOT NULL,
    fecha_venta DATETIME NOT NULL,
    monto_total_venta_usd REAL NOT NULL DEFAULT 0,
    monto_total_venta_vef REAL NOT NULL DEFAULT 0,
    tasa_cambio_aplicada REAL NOT NULL DEFAULT 0,
    notas TEXT,
    FOREIGN KEY (id_usuario_cajero) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
)


TABLE DetallesVenta (
    id_detalle_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    id_producto_elaborado  INTEGER NULL,
    id_producto_reventa INTEGER NULL,
    -- Campos para identificar el lote específico vendido
    id_lote_producto_elaborado_vendido INTEGER NULL, -- FK a LotesProductosElaborados(id_lote_producto_elaborado)
    id_lote_producto_reventa_vendido INTEGER NULL,   -- FK a LotesProductosReventa(id_lote_producto_reventa)

    id_unidad_medida_venta INTEGER NOT NULL,
    precio_unitario_usd REAL NOT NULL,
    subtotal_linea_usd REAL NOT NULL, -- El subtotal_linea_usd se calcularía como cantidad_vendida * precio_unitario_usd
    cantidad_vendida NOT NULL,
    FOREIGN KEY id_venta REFERENCES Ventas(id_venta),
    FOREIGN KEY id_unidad_medida_venta REFERENCES UnidadesDeMedida(id_unidad_medida),
    FOREIGN KEY id_producto_elaborado REFERENCES ProductosElaborados(id_producto_elaborado),
    FOREIGN KEY (id_lote_producto_elaborado_vendido) REFERENCES LotesProductosElaborados(id_lote_producto_elaborado), -- Suponiendo que creas LotesProductosElaborados
    FOREIGN KEY (id_lote_producto_reventa_vendido) REFERENCES LotesProductosReventa(id_lote_producto_reventa),

        -- El CHECK constraint se vuelve un poco más complejo o podría necesitar ajustes:
    CHECK (
        -- Caso 1: Se vende un Producto Elaborado (debe tener lote de producto elaborado)
        (id_producto_elaborado IS NOT NULL AND id_producto_reventa IS NULL AND id_lote_producto_elaborado_vendido IS NOT NULL AND id_lote_producto_reventa_vendido IS NULL)
        OR
        -- Caso 2: Se vende un Producto de Reventa que se maneja por lotes (debe tener lote de producto de reventa)
        (id_producto_elaborado IS NULL AND id_producto_reventa IS NOT NULL AND id_lote_producto_reventa_vendido IS NOT NULL AND id_lote_producto_elaborado_vendido IS NULL)
        OR
        -- Caso 3: Se vende un Producto de Reventa que NO se maneja por lotes (no debe tener ningún lote)
        (id_producto_elaborado IS NULL AND id_producto_reventa IS NOT NULL AND id_lote_producto_reventa_vendido IS NULL AND id_lote_producto_elaborado_vendido IS NULL)
        -- Este último caso (Reventa NO lotted) implica que la obligatoriedad del id_lote_producto_reventa_vendido
    )
)


TABLE MetodosPago (
    id_metodo_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_metodo_pago TEXT NOT NULL UNIQUE -- Ej: "Efectivo USD", "Efectivo Bs.", "Tarjeta de Débito", "Tarjeta de Crédito", "Transferencia Zelle", "Pago Móvil", "Punto de Venta", "Otro"
    requiere_referencia BOOLEAN NOT NULL DEFAULT 0 -- Si este método usualmente necesita un número de referenciA
)


TABLE Orden (
    id_orden INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_estado_orden INTEGER NOT NULL,
    fecha_creacion_orden DATETIME NOT NULL,
    fecha_entrega_solicitado DATETIME NOT NULL,
    fecha_entrega_definitiva DATETIME NOT NULL,
    id_usuario_creador INTEGER NOT NULL,
    notas_generales_orden TEXT,
    monto_descuento_usd REAL DEFAULT 0,
    monto_total_orden_usd REAL NOT NULL DEFAULT 0,
    monto_total_orden_vef REAL NOT NULL DEFAULT 0,
    tasa_cambio_aplicada REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_estado_orden) REFERENCES EstadosOrden(id_estado_orden),
    FOREIGN KEY (id_usuario_creador) REFERENCES Usuarios(id_usuario),
)


TABLE DetallesOrden (
    id_detalle_orden INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produccion_asociada INTEGER NULL, -- FK a Produccion (opcional, si una línea se manda a producir específicamente)
    id_orden INTEGER NOT NULL -- FK a Ordenes
    id_producto_elaborado INTEGER NULL, -- FK a ProductosElaborados
    id_producto_reventa INTEGER NULL, -- FK a ProductosReventa
    cantidad_solicitada REAL NOT NULL,
    id_unidad_medida_venta INTEGER NOT NULL, -- FK a UnidadesDeMedida. Debería ser la unidad en que se vende el producto. DISCUTIR!!!
    precio_unitario_acordado REAL NOT NULL, -- Precio al momento de la orden (puede ser el de lista o uno especial)
    subtotal_linea REAL NOT NULL, -- (cantidad * precio_unitario_acordado)
    notas_detalle_producto,
    FOREIGN KEY id_orden REFERENCES Orden(id_orden),
    FOREIGN KEY (id_producto_elaborado) REFERENCES ProductosElaborados(id_producto_elaborado),
    FOREIGN KEY (id_unidad_medida_venta) REFERENCES UnidadesDeMedida(id_unidad_medida),
    FOREIGN KEY (id_produccion_asociada) REFERENCES Produccion(id_produccion),
    CHECK 
    (
        (id_producto_elaborado IS NOT NULL AND id_producto_reventa IS NULL) OR
        (id_producto_elaborado IS NULL AND id_producto_reventa IS NOT NULL)
    )
)


TABLE Pagos (
    id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NULL, -- FK a TransaccionesVenta (si es un pago de venta directa)
    id_orden INTEGER NULL, -- FK a Ordenes (si es un pago para saldar una orden)
    id_metodo_pago INTEGER NOT NULL, -- FK a MetodosPago
    monto_pagado_usd_equivalente REAL NOT NULL,
    monto_pagado_vef REAL NOT NULL,
    tasa_cambio_pago REAL NOT NULL,
    fecha_pago DATETIME NOT NULL,
    referencia_pago TEXT, -- Nro. de confirmación, últimos 4 dígitos tarjeta, etc.
    id_usuario_registro_pago INTEGER, -- FK a Usuarios
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta),
    FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden),
    FOREIGN KEY (id_metodo_pago) REFERENCES MetodosPago(id_metodo_pago),
    FOREIGN KEY (id_usuario_registro_pago) REFERENCES Usuarios(id_usuario),
    -- Asegura que el pago pertenezca a una venta O a una orden, pero no a ambas, y al menos a una.
    CHECK ((id_venta IS NOT NULL AND id_orden IS NULL) OR (id_venta IS NULL AND id_orden IS NOT NULL))
)


TABLE Proveedor (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_proveedor TEXT NOT NULL,
    apellido_nombre TEXT NOT NULL,
    nombre_empresa TEXT,
    email_contacto TEXT,
    telefono_contacto TEXT,
    notas_proveedor TEXT, -- Cualquier observación adicional sobre el proveedor
    fecha_creacion_registro DATETIME NOT NULL,
    id_usuario_registrador INTEGER NOT NULL,
    FOREIGN KEY id_usuario_registrador REFERENCES Usuarios(id_usuario)
)


TABLE EstadosOrdenCompra (
    id_estado_oc INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_estado_oc TEXT NOT NULL UNIQUE, -- Ej: "Borrador", "Emitida", "Recibida Parcialmente", "Recibida Completa", "Cancelada"
    descripcion_estado_oc TEXT
)


TABLE OrdenesCompra (
    id_orden_compra INTEGER PRIMARY KEY AUTOINCREMENT,
    id_proveedor INTEGER NOT NULL, -- FK a Proveedores
    id_usuario_creador INTEGER NOT NULL, -- FK a Usuarios (quien creó la OC)
    fecha_emision_oc DATETIME NOT NULL,
    fecha_entrega_esperada DATE, -- Fecha en que se espera recibir los productos
    fecha_entrega_real DATETIME NULL, -- Fecha y hora real cuando se recibe la mercancía
    id_estado_oc INTEGER NOT NULL, -- FK a EstadosOrdenCompra

    subtotal_oc_usd REAL NOT NULL DEFAULT 0,          -- Suma de subtotal_linea_usd de los detalles
    monto_impuestos_oc_usd REAL NOT NULL DEFAULT 0,   -- Impuestos sobre el subtotal_oc_usd
    monto_total_oc_usd REAL NOT NULL DEFAULT 0,       -- (subtotal_oc_usd + monto_impuestos_oc_usd)

    tasa_cambio_aplicada REAL NOT NULL DEFAULT 0,     -- Tasa VEF por USD (ej: 36.50)

    subtotal_oc_vef REAL NOT NULL DEFAULT 0,          -- Calculado: subtotal_oc_usd * tasa_cambio_aplicada
    monto_impuestos_oc_vef REAL NOT NULL DEFAULT 0,   -- Calculado: monto_impuestos_oc_usd * tasa_cambio_aplicada
    monto_total_oc_vef REAL NOT NULL DEFAULT 0,  

    id_metodo_pago INTEGER NOT NULL,
    direccion_envio TEXT, -- Dirección donde se deben entregar los insumos (puede ser la de la panadería)
    notas_oc TEXT, -- Notas generales para la orden de compra
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor),
    FOREIGN KEY (id_usuario_creador) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_estado_oc) REFERENCES EstadosOrdenCompra(id_estado_oc),
    FOREIGN KEY (id_metodo_pago) REFERENCES MetodosPago(id_metodo_pago),
)


TABLE DetallesOrdenCompra (
    id_detalle_oc INTEGER PRIMARY KEY AUTOINCREMENT,
    id_orden_compra INTEGER NOT NULL, -- FK a OrdenesCompra
    id_materia_prima INTEGER NULL, -- FK a MateriasPrimas
    id_producto_reventa INTEGER  NULL, -- FK a Productos Reventa
    cantidad_solicitada REAL NOT NULL, -- En la unidad base de la materia prima
    id_unidad_medida_compra INTEGER NOT NULL, -- FK a UnidadesDeMedida (debe ser la unidad base de la materia prima)
    costo_unitario_acordado_usd REAL NOT NULL, -- Precio por unidad de la materia prima según el proveedor para esta OC
    subtotal_linea_usd  REAL NOT NULL, -- (cantidad_solicitada * costo_unitario_acordado)
    cantidad_recibida_detalle REAL DEFAULT 0, -- Cantidad realmente recibida para esta línea (para soportar recepciones parciales)
    notas_detalle TEXT, -- Notas específicas para esta línea de la OC
    FOREIGN KEY (id_orden_compra) REFERENCES OrdenesCompra(id_orden_compra),
    FOREIGN KEY (id_materia_prima) REFERENCES MateriasPrimas(id_materia_prima),
    FOREIGN KEY (id_unidad_medida_compra) REFERENCES UnidadesDeMedida(id_unidad_medida),
    FOREIGN KEY (id_producto_reventa) REFERENCES ProductosReventa(id_producto_reventa),
    CHECK (
        (id_materia_prima IS NOT NULL AND id_producto_reventa IS NULL) OR
        (id_materia_prima IS NULL AND id_producto_reventa IS NOT NULL)
    ) 
)















-- Cálculo de Empaques Completos (para visualización/reportes) para materias primas:

--     EmpaquesCompletos = FLOOR(stock_actual / cantidad_por_empaque_estandar) (Asegurándote que las unidades sean compatibles o haciendo conversión).

-- Cálculo de Cantidad en Empaque Parcial (para visualización/reportes):

--     CantidadSuelta = stock_actual % cantidad_por_empaque_estandar (o stock_actual - (EmpaquesCompletos * cantidad_por_empaque_estandar)).

-- Registro de Compras (Restock):

--     El usuario puede decir "Compré 5 sacos de harina".
--     Tu sistema sabe que 1 saco de harina (nombre_empaque_estandar="Saco") tiene 25 kg (cantidad_por_empaque_estandar=25, unidad_medida_empaque="kg").
--     Entonces, el sistema incrementa el stock_actual (que está en kg para la harina) en 5 * 25 = 125 kg.
--     UPDATE MateriasPrimas SET stock_actual = stock_actual + (cantidad_empaques_comprados * cantidad_por_empaque_estandar) WHERE ...