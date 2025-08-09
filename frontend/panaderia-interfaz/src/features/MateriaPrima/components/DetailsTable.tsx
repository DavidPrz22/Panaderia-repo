import { DetailsField } from "@/components/DetailsField";
import { DetailFieldValue } from "@/components/DetailFieldValue";
import type { MateriaPrimaListServer } from "../types/types";

export const DetailsTable = ({materiaprimaDetalles}: {materiaprimaDetalles: MateriaPrimaListServer}) => {
  return (
    <div className="flex items-center gap-20">
          <div className="grid grid-rows-12 grid-cols-1 gap-2">
            <DetailsField>Nombre</DetailsField>
            <DetailsField>SKU</DetailsField>
            <DetailsField>Punto de reorden</DetailsField>
            <DetailsField>Unidad de medida</DetailsField>
            <DetailsField>Categoría</DetailsField>
            <DetailsField>Nombre de empaque</DetailsField>
            <DetailsField>Cantidad de empaquete</DetailsField>
            <DetailsField>Unidad de medida de empaque</DetailsField>
            <DetailsField>Fecha de última actualización</DetailsField>
            <DetailsField>Fecha de creación del registro</DetailsField>
            <DetailsField>Fecha de modificación del registro</DetailsField>
            <DetailsField>Descripción</DetailsField>
          </div>
          <div className="grid grid-rows-12 grid-cols-1 gap-2">
            <DetailFieldValue>
              {materiaprimaDetalles?.nombre || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.SKU || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.punto_reorden || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.unidad_medida_base_detail
                ?.nombre_completo || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.categoria_detail?.nombre_categoria || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.nombre_empaque_estandar || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.cantidad_empaque_estandar || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.unidad_medida_empaque_estandar_detail
                ?.nombre_completo || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.fecha_ultima_actualizacion || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.fecha_creacion_registro || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.fecha_modificacion_registro || "-"}
            </DetailFieldValue>
            <DetailFieldValue>
              {materiaprimaDetalles?.descripcion || "-"}
            </DetailFieldValue>
          </div>
    </div>
  );
};