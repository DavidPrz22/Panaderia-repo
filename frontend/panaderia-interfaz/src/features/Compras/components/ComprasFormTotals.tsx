interface TotalRowProps {
  label: string;
  value: string;
  isBold?: boolean;
  isLarge?: boolean;
  className?: string;
}

const TotalRow = ({ label, value, isBold = false, isLarge = false, className = "" }: TotalRowProps) => {
  const textSize = isLarge ? "text-xl" : "text-base";
  const fontWeight = isBold ? "font-bold" : "font-medium";
  const labelColor = isBold ? "" : "text-muted-foreground";
  
  return (
    <div className={`flex justify-between ${textSize} ${className}`}>
      <span className={`${labelColor} ${isBold ? 'font-bold' : ''}`}>{label}</span>
      <span className={fontWeight}>{value}</span>
    </div>
  );
};

interface TotalsSectionProps {
  title?: string;
  rows: Array<{
    label: string;
    value: string;
    isBold?: boolean;
    isLarge?: boolean;
    className?: string;
  }>;
  width?: string;
}

const TotalsSection = ({ rows, width = "w-60" }: TotalsSectionProps) => {
  return (
    <div className={`space-y-2 ${width}`}>
      {rows.map((row, index) => (
        <TotalRow key={index} {...row} />
      ))}
    </div>
  );
};

interface ComprasFormTotalsProps {
  bcvRate?: number;
  totalVes: number;
  totalUsd: number;
  formatCurrency: (amount: number) => string;
}

export const ComprasFormTotals = ({
  bcvRate,
  totalVes,
  totalUsd,
  formatCurrency,
}: ComprasFormTotalsProps) => {
  const vesSection = [
    {
      label: "Tasa de Cambio VES:",
      value: bcvRate ? bcvRate.toFixed(2) : '0.00',
    },
    {
      label: "Total en VES:",
      value: totalVes.toFixed(2),
    },
  ];

  const usdSection = [
    {
      label: "Total en Divisas:",
      value: formatCurrency(totalUsd),
      isBold: true,
      isLarge: true,
      className: "border-t pt-2",
    },
  ];

  return (
    <div className="border-t pt-4 flex justify-end">
      <div className="space-y-2">
        <TotalsSection rows={vesSection} width="w-80" />
        <TotalsSection rows={usdSection} width="w-80" />
      </div>
    </div>
  );
};

