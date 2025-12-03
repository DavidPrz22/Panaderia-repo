import { pdf } from "@react-pdf/renderer";
import { OrdenCompraPDF } from "../components/OrdenCompraPDF";
import type { OrdenCompra } from "../types/types";
import { HadleFileConversion } from "@/utils/utils";
import type { TFileBase64 } from "@/utils/utils";

/**
 * Utility function to convert an OrdenCompra to a base64 PDF file.
 * Can be called from anywhere, including regular functions.
 *
 * @param ordenCompra - The order purchase object to convert to PDF
 * @returns Promise that resolves to a TFileBase64 object with the PDF content
 * @throws Error if PDF generation or conversion fails
 */
export const getPDFAsBase64 = async (
  ordenCompra: OrdenCompra,
): Promise<TFileBase64> => {
  const pdfDoc = <OrdenCompraPDF ordenCompra={ordenCompra} />;
  const blob = await pdf(pdfDoc).toBlob();

  if (!blob) {
    throw new Error("Error al generar el PDF. Por favor, intenta nuevamente.");
  }

  const base64 = await HadleFileConversion(
    new File([blob], `orden-compra-${ordenCompra.id}.pdf`, {
      type: "application/pdf",
    }),
  );

  if (!base64) {
    throw new Error(
      "Error al convertir el PDF a base64. Por favor, intenta nuevamente.",
    );
  }

  return base64;
};
