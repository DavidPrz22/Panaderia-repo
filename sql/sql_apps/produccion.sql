-- Produccion App

CREATE TABLE Produccion (
    id SERIAL PRIMARY KEY,
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

CREATE TABLE Recetas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    producto_elaborado_id INTEGER UNIQUE,
    fecha_creacion TIMESTAMP,
    fecha_modificacion TIMESTAMP,
    notas TEXT,
    FOREIGN KEY (producto_elaborado_id) REFERENCES ProductosElaborados(id)
);

CREATE TABLE RecetasDetalles (
    id SERIAL PRIMARY KEY,
    receta_id INTEGER,
    componente_materia_prima_id INTEGER,
    componente_producto_intermedio_id INTEGER,
    cantidad DECIMAL(10, 3) DEFAULT 0,
    FOREIGN KEY (receta_id) REFERENCES Recetas(id),
    FOREIGN KEY (componente_materia_prima_id) REFERENCES MateriasPrimas(id),
    FOREIGN KEY (componente_producto_intermedio_id) REFERENCES ProductosElaborados(id),
    CONSTRAINT receta_un_solo_tipo_componente CHECK (
        (componente_materia_prima_id IS NOT NULL AND componente_producto_intermedio_id IS NULL) OR
        (componente_materia_prima_id IS NULL AND componente_producto_intermedio_id IS NOT NULL)
    )
);

CREATE TABLE RelacionesRecetas (
    id SERIAL PRIMARY KEY,
    receta_principal_id INTEGER NOT NULL,
    subreceta_id INTEGER NOT NULL,
    FOREIGN KEY (receta_principal_id) REFERENCES Recetas(id),
    FOREIGN KEY (subreceta_id) REFERENCES Recetas(id)
);

CREATE TABLE DetalleProduccionCosumos (
    id SERIAL PRIMARY KEY,
    produccion_id INTEGER NOT NULL,
    materia_prima_consumida_id INTEGER,
    producto_intermedio_consumido_id INTEGER,
    cantidad_consumida DECIMAL(10, 3) NOT NULL,
    costo_consumo_usd DECIMAL(10, 3) DEFAULT 0,
    FOREIGN KEY (produccion_id) REFERENCES Produccion(id),
    FOREIGN KEY (materia_prima_consumida_id) REFERENCES MateriasPrimas(id),
    FOREIGN KEY (producto_intermedio_consumido_id) REFERENCES ProductosElaborados(id),
    CONSTRAINT mp_o_pi_en_detalle CHECK (
        (materia_prima_consumida_id IS NOT NULL AND producto_intermedio_consumido_id IS NULL) OR
        (materia_prima_consumida_id IS NULL AND producto_intermedio_consumido_id IS NOT NULL)
    )
);

CREATE TABLE DetalleProduccionLote (
    id SERIAL PRIMARY KEY,
    detalle_produccion_id INTEGER NOT NULL,
    lote_materia_prima_id INTEGER,
    lote_producto_intermedio_id INTEGER,
    cantidad_consumida DECIMAL(10, 3) NOT NULL,
    costo_parcial_usd DECIMAL(10, 3) DEFAULT 0,
    FOREIGN KEY (detalle_produccion_id) REFERENCES DetalleProduccionCosumos(id),
    FOREIGN KEY (lote_materia_prima_id) REFERENCES LotesMateriasPrimas(id),
    FOREIGN KEY (lote_producto_intermedio_id) REFERENCES LotesProductosElaborados(id),
    CONSTRAINT un_solo_tipo_lote_en_detalle CHECK (
        (lote_materia_prima_id IS NOT NULL AND lote_producto_intermedio_id IS NULL) OR
        (lote_materia_prima_id IS NULL AND lote_producto_intermedio_id IS NOT NULL)
    )
);

CREATE TABLE DefinicionTransformacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    producto_elaborado_entrada_id INTEGER NOT NULL,
    cantidad_entrada DECIMAL(10, 2) DEFAULT 0,
    unidad_medida_entrada_id INTEGER NOT NULL,
    producto_elaborado_salida_id INTEGER NOT NULL,
    unidad_medida_salida_id INTEGER NOT NULL,
    cantidad_salida DECIMAL(10, 2) DEFAULT 0,
    usuario_creacion_id INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (producto_elaborado_entrada_id) REFERENCES ProductosElaborados(id),
    FOREIGN KEY (unidad_medida_entrada_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (producto_elaborado_salida_id) REFERENCES ProductosElaborados(id),
    FOREIGN KEY (unidad_medida_salida_id) REFERENCES UnidadesDeMedida(id),
    FOREIGN KEY (usuario_creacion_id) REFERENCES Users(id)
);

CREATE TABLE LogTransformacion (
    id SERIAL PRIMARY KEY,
    definicion_transformacion_id INTEGER NOT NULL,
    cantidad_producto_entrada_efectiva DECIMAL(10, 2) DEFAULT 0,
    cantidad_producto_salida_total_generado DECIMAL(10, 2) DEFAULT 0,
    costo_unitario_entrada_usd DECIMAL(10, 2) DEFAULT 0,
    costo_total_entrada_calculado_usd DECIMAL(10, 2) DEFAULT 0,
    costo_unitario_salida_calculado_usd DECIMAL(10, 2) DEFAULT 0,
    usuario_creacion_id INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    notas TEXT,
    FOREIGN KEY (definicion_transformacion_id) REFERENCES DefinicionTransformacion(id),
    FOREIGN KEY (usuario_creacion_id) REFERENCES Users(id)
);
