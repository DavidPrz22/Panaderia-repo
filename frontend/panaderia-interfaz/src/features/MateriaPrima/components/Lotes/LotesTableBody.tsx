import { LotesTableHeader } from "./LotesTableHeader";

export const LotesTableBody = () => {
  return (
    <div>
      <LotesTableHeader
        headers={[
          "Fecha de recepción",
          "Fecha de caducidad",
          "Cantidad recibida",
          "Stock actual",
          "Costo unitario USD",
          "Proveedor",
          "Activo",
        ]}
      />
    </div>
  );
};
