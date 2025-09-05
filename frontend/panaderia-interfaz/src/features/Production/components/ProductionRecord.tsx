import { ProductionRecordHeader } from "./ProductionRecordHeader";
import { ProductionRecordCantidad } from "./ProductionRecordCantidad";
import { ProductionRecordFooter } from "./ProductionRecordFooter";
import { ProductionRecordFechaProductor } from "./ProductionRecordFechaProductor";
// Mock catalog of elaborated products used in registeredProductions

type Production = {
  id: string;
  fecha_produccion: string;
  fecha_vencimiento: string;
  producto: {
    id: string;
    nombre: string;
    descripcion: string;
    unidad_medida: string;
  };
  cantidad_producida: number;
  estado: string;
  componentes_utilizados: {
    nombre: string;
    cantidad: number;
    unidad: string;
  }[];
  registrado_por: string;
};

export function ProductionRecord({ production }: { production: Production }) {
  return (
    <div className="p-6 pt-0 font-[Roboto]">
      <div
        key={production.id}
        className="border-2 border-blue-100 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-[border, box-shadow] duration-300"
      >
        <ProductionRecordHeader
          nombre={production.producto.nombre}
          descripcion={production.producto.descripcion}
        />

        <ProductionRecordFechaProductor
          fecha_produccion={new Date(
            production.fecha_produccion,
          ).toLocaleDateString()}
          fecha_vencimiento={new Date(
            production.fecha_vencimiento,
          ).toLocaleDateString()}
          registrado_por={production.registrado_por}
        />

        <ProductionRecordCantidad
          cantidad_producida={production.cantidad_producida}
          unidad_medida={production.producto.unidad_medida}
        />

        {/* Components Used */}
        <div className="rounded-lg p-4 bg-gray-100">
          <h4 className="text-sm font-semibold mb-3">Componentes Utilizados</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {production.componentes_utilizados.map((componente, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm py-1"
              >
                <span className="">{componente.nombre}</span>
                <span className="font-medium">
                  {componente.cantidad}
                  {componente.unidad}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ID Footer */}
        <ProductionRecordFooter id={production.id} />
      </div>
    </div>
  );
}
