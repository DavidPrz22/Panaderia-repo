export type Transformacion = {
    id: number;
    nombre_transformacion: string;
    cantidad_origen: number;
    cantidad_destino: number;
    fecha_creacion: Date;
    activo: boolean;
};

export type EjecutarTransformacionFormData = {
    id: number;
    nombre_transformacion: string;
    producto_origen: string;
    producto_destino: string;
    fecha_ejecucion: Date;
    activo: boolean;
};

