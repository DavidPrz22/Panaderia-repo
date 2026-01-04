import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}

export const DashboardError = ({ title, message, onRetry }: DashboardErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <AlertCircle className="w-12 h-12 text-destructive" />
      <div className="text-center">
        <h3 className="font-semibold">{title}</h3>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Reintentar
        </Button>
      )}
    </div>
  );
};
