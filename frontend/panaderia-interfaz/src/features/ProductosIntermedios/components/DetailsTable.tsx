import { DetailsField } from "@/components/DetailsField";
import { DetailFieldValue } from "@/components/DetailFieldValue";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";

export const DetailsTable = () => {

  const { productoIntermediosDetalles } = useProductosIntermediosContext();

  return (
    <div className="flex items-center gap-20">
          <div className="grid grid-rows-12 grid-cols-1 gap-2">
            <DetailsField>Nombre del producto</DetailsField>
            <DetailsField>Id del producto</DetailsField>
            <DetailsField>SKU</DetailsField>
            <DetailsField>Punto de reorden</DetailsField>
            <DetailsField>Unidad de medida</DetailsField>
            <DetailsField>Categoría</DetailsField>
            <DetailsField>Fecha de creación del registro</DetailsField>
            <DetailsField>Descripción</DetailsField>
          </div>
          <div className="grid grid-rows-12 grid-cols-1 gap-2">
            <DetailFieldValue>
              {productoIntermediosDetalles?.nombre_producto}
            </DetailFieldValue>
            <DetailFieldValue>
              {productoIntermediosDetalles?.id}
            </DetailFieldValue>
            <DetailFieldValue>
              {productoIntermediosDetalles?.SKU}
            </DetailFieldValue>
            <DetailFieldValue>
              {productoIntermediosDetalles?.stock_actual}
            </DetailFieldValue>
            <DetailFieldValue>
              {productoIntermediosDetalles?.punto_reorden}
            </DetailFieldValue>
            <DetailFieldValue>
              {productoIntermediosDetalles?.categoria_nombre}
            </DetailFieldValue>
            <DetailFieldValue>
              {productoIntermediosDetalles?.fecha_creacion_registro}
            </DetailFieldValue>
            <DetailFieldValue>
              {productoIntermediosDetalles?.descripcion || "No hay descripción"}
            </DetailFieldValue>
          </div>
        </div>  
  );
};