-- Transformacion App

CREATE TABLE Transformacion (
    id SERIAL PRIMARY KEY,
    nombre_transformacion VARCHAR(255) NOT NULL,
    cantidad_origen DECIMAL(10, 3) NOT NULL,
    cantidad_destino DECIMAL(10, 3) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE EjecutarTransformacion (
    id SERIAL PRIMARY KEY,
    transformacion_id INTEGER NOT NULL,
    producto_origen_id INTEGER NOT NULL,
    producto_destino_id INTEGER NOT NULL,
    fecha_ejecucion TIMESTAMP NOT NULL,
    FOREIGN KEY (transformacion_id) REFERENCES Transformacion(id),
    FOREIGN KEY (producto_origen_id) REFERENCES ProductosElaborados(id),
    FOREIGN KEY (producto_destino_id) REFERENCES ProductosElaborados(id)
);
