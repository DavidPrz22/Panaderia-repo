import type { ComponentesUIRecepcion, OrdenCompra } from "../types/types";

export const getReceptions = (
  ordenCompra: OrdenCompra,
): ComponentesUIRecepcion[] => {
  const isPartial =
    ordenCompra.estado_oc.nombre_estado === "Recibida Parcial" ? true : false;
  if (isPartial) {
    const completedReceptions: ComponentesUIRecepcion[] = ordenCompra.detalles
      .filter((line) => line.cantidad_pendiente > 0)
      .map((line) => ({
        linea_oc: line,
        lotes: [
          { id: 1, cantidad: line.cantidad_pendiente, fecha_caducidad: "" },
        ],
        cantidad_total_recibida: Number(line.cantidad_pendiente),
        cantidad_en_inventario: Number(line.cantidad_recibida),
        cantidad_pendiente: Number(line.cantidad_pendiente),
      }));

    return completedReceptions;
  }
  const pendingReceptions: ComponentesUIRecepcion[] = ordenCompra.detalles.map(
    (line) => ({
      linea_oc: line,
      lotes: [
        { id: 1, cantidad: line.cantidad_solicitada, fecha_caducidad: "" },
      ],
      cantidad_total_recibida: Number(line.cantidad_solicitada),
    }),
  );

  return pendingReceptions;
};
