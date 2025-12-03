interface ComprasRecepcionTotalsProps {
  tasaCambioAplicada: number;
  totalRecepcionUSD: number;
  totalRecepcionVES: number;
  totalRecepcionUSDConAdelanto: number;
  totalRecepcionVESConAdelanto: number;
  pagosEnAdelantado?: {
    monto_pago_usd: number;
    monto_pago_ves: number;
  } | null;
  formatCurrency: (amount: number) => string;
}

export function ComprasRecepcionTotals({
  tasaCambioAplicada,
  totalRecepcionUSD,
  totalRecepcionVES,
  totalRecepcionUSDConAdelanto,
  totalRecepcionVESConAdelanto,
  pagosEnAdelantado,
  formatCurrency,
}: ComprasRecepcionTotalsProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg border border-green-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
          Totales de Recepción
        </h3>
      </div>
      <div className="border-t border-green-200 pt-4 flex flex-col items-end">
        <div className="space-y-1 w-80">
          {/* Exchange Rate */}
          <div className="flex justify-between items-center text-base">
            <span className="text-muted-foreground font-medium">
              Tasa de Cambio VES:
            </span>
            <span className="font-semibold text-gray-900">
              {Number(tasaCambioAplicada).toFixed(2)}
            </span>
          </div>

          {/* Total Reception USD */}
          <div className="flex justify-between items-center text-base">
            <span className="text-muted-foreground font-medium">
              Total Recepción USD:
            </span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totalRecepcionUSD)}
            </span>
          </div>

          {/* Advance Payment USD (if exists) */}
          {pagosEnAdelantado && (
            <div className="flex justify-between items-center text-base">
              <span className="text-muted-foreground font-medium">
                Pago Adelantado USD:
              </span>
              <span className="font-semibold text-red-600">
                - {formatCurrency(Number(pagosEnAdelantado.monto_pago_usd))}
              </span>
            </div>
          )}

          {/* Total Reception VES */}
          <div className="flex justify-between items-center text-base">
            <span className="text-muted-foreground font-medium">
              Total Recepción VES:
            </span>
            <span className="font-semibold text-gray-900">
              {totalRecepcionVES.toFixed(2)}
            </span>
          </div>

          {/* Advance Payment VES (if exists) */}
          {pagosEnAdelantado && (
            <div className="flex justify-between items-center text-base">
              <span className="text-muted-foreground font-medium">
                Pago Adelantado VES:
              </span>
              <span className="font-semibold text-red-600">
                - {Number(pagosEnAdelantado.monto_pago_ves).toFixed(2)}
              </span>
            </div>
          )}
        </div>
        <div className=" w-80">
          {/* Final Total USD */}
          <div className="flex justify-between items-center text-md border-t border-green-300 pt-3 mt-2">
            <span className="font-bold text-gray-900">Total a Pagar USD:</span>
            <span className="font-bold text-lg">
              {formatCurrency(totalRecepcionUSDConAdelanto)}
            </span>
          </div>

          {/* Final Total VES */}
          <div className="flex justify-between items-center text-md">
            <span className="font-bold text-gray-900">Total a Pagar VES:</span>
            <span className="font-bold text-lg">
              {totalRecepcionVESConAdelanto.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
