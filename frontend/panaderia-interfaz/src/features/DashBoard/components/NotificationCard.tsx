import { Clock, Package, TruckIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Notification } from "../types/types";

const iconMap = {
  stock: Package,
  expiracion: Clock,
  orden: TruckIcon,
  entrega: TruckIcon,
};

const priorityColors = {
  high: "bg-destructive text-destructive-foreground text-white",
  medium: "bg-warning bg-amber-500 text-white",
  low: "bg-secondary bg-green-600 text-white",
};

const priorityIconColor = {
    high: "bg-destructive/10",
    medium: "bg-amber-500/10",
    low: "bg-green-600/10",
}

export const NotificationCard = ({id, priority, type, title, time, message}: Notification) => {
    const Icon = iconMap[type]
    return (
            <div
              key={id}
              className="flex gap-3 p-4 rounded-lg border bg-card hover:bg-secondary/50 transition-colors"
            >
              <div className={`p-2 rounded-lg h-fit ${priorityIconColor[priority]}`}> 
                <Icon className={`h-4 w-4 ${priority === 'high' ? 'text-destructive' : 'text-primary'} `} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <Badge className={priorityColors[priority]} variant="secondary">
                      {priority === "high" ? "Alta" : priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{message}</p>
                <p className="text-xs text-muted-foreground">{time}</p>
              </div>
            </div>
          );
};