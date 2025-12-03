import { useMemo } from "react";
import { usePDF } from "@react-pdf/renderer";
import { OrdenCompraPDF } from "./OrdenCompraPDF";
import type { OrdenCompra } from "../types/types";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ComprasPDFDownload = ({
  ordenCompra,
}: {
  ordenCompra: OrdenCompra;
}) => {
  const pdfDocument = useMemo(
    () => <OrdenCompraPDF ordenCompra={ordenCompra} />,
    [ordenCompra],
  );

  const [instance] = usePDF({ document: pdfDocument });

  const handleDownloadPDF = () => {
    if (instance.url) {
      const link = document.createElement("a");
      link.href = instance.url;
      link.download = `orden-compra-${ordenCompra.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (instance.error) {
      console.error("Cannot download PDF:", instance.error);
      alert("Error al generar el PDF. Por favor, intenta nuevamente.");
    } else {
      console.warn("PDF URL not available yet. Loading:", instance.loading);
    }
  };

  return (
    <Button
      variant="outline"
      className="cursor-pointer px-5 py-6 font-semibold"
      onClick={handleDownloadPDF}
      disabled={instance.loading || !!instance.error}
    >
      <FileDown className="size-5" />
      {instance.loading
        ? "Generando PDF..."
        : instance.error
          ? "Error al generar PDF"
          : "Descargar PDF"}
    </Button>
  );
};
