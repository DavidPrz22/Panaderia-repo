import { useMutation } from "@tanstack/react-query";
import { downloadInventoryReportPDF, downloadSalesReportPDF } from "../../api/api";

export const useDownloadSalesReportPDFMutation = () => {
  return useMutation<Blob, Error, { start_date?: string; end_date?: string } | undefined>({
    mutationFn: (params) => downloadSalesReportPDF(params),
  });
};

export const useDownloadInventoryReportPDFMutation = () => {
  return useMutation<Blob, Error, string>({
    mutationFn: (type) => downloadInventoryReportPDF(type),
  });
};
