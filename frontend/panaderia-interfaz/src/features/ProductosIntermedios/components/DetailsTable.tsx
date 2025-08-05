import { DetailsField } from "@/components/DetailsField";
import { DetailFieldValue } from "@/components/DetailFieldValue";

export const DetailsTable = () => {
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
              Randon Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
            <DetailFieldValue>
              Random Text
            </DetailFieldValue>
          </div>
        </div>  
  );
};