import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Package, TruckIcon, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificacionesFiltro } from "./NotificacionesFiltro";

interface Notification {
  id: string;
  type: "stock" | "expiry" | "order" | "delivery";
  title: string;
  message: string;
  time: string;
  priority: "high" | "medium" | "low";
}


const notifications: Notification[] = [
  {
    id: "1",
    type: "stock",
    title: "Stock Bajo",
    message: "Harina de Trigo está por debajo del punto de reorden (15kg disponible)",
    time: "Hace 5 min",
    priority: "high",
  },
  {
    id: "2",
    type: "expiry",
    title: "Lote por Vencer",
    message: "Lote Leche #L2401 vence en 2 días (25 litros)",
    time: "Hace 15 min",
    priority: "high",
  },
  {
    id: "3",
    type: "delivery",
    title: "Entrega Próxima",
    message: "Orden de venta OV-125 debe entregarse mañana (Cliente: María García)",
    time: "Hace 1 hora",
    priority: "medium",
  },
  {
    id: "4",
    type: "stock",
    title: "Stock Crítico",
    message: "Levadura está en nivel crítico (3kg disponible)",
    time: "Hace 2 horas",
    priority: "high",
  },
  {
    id: "5",
    type: "order",
    title: "Orden Pendiente",
    message: "Orden de compra OC-103 pendiente de confirmación",
    time: "Hace 3 horas",
    priority: "low",
  },
  {
    id: "6",
    type: "expiry",
    title: "Lote por Vencer",
    message: "Lote Huevos #H1523 vence en 3 días (120 unidades)",
    time: "Hace 4 horas",
    priority: "medium",
  },
];

const iconMap = {
  stock: Package,
  expiry: Clock,
  order: TruckIcon,
  delivery: TruckIcon,
};

const priorityColors = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-warning text-warning-foreground",
  low: "bg-secondary text-secondary-foreground",
};

export function DashBoardNotificacionesPanel() {
  const filterByType = (type?: string) => 
    type ? notifications.filter(n => n.type === type) : notifications;

  const NotificationList = ({ items }: { items: Notification[] }) => (
    <ScrollArea className="h-[500px]">
      <div className="space-y-3 pr-4">
        {items.map((notification) => {
          const Icon = iconMap[notification.type];
          return (
            <div
              key={notification.id}
              className="flex gap-3 p-4 rounded-lg border bg-card hover:bg-secondary/50 transition-colors"
            >
              <div className={`p-2 rounded-lg h-fit ${notification.priority === 'high' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                <Icon className={`h-4 w-4 ${notification.priority === 'high' ? 'text-destructive' : 'text-primary'}`} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                    <Badge className={priorityColors[notification.priority]} variant="secondary">
                      {notification.priority === "high" ? "Alta" : notification.priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Centro de Notificaciones</span>
          <div className="flex items-center gap-4 justify-end">
            <div className="text-sm font-semibold">
              Filtrar por tipos:
            </div>
            <NotificacionesFiltro id="notificaciones-filtro" placeholder="Selecciona un tipo" value="1" onChange={(v) => console.log(v)}/>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="expiry">Vencimiento</TabsTrigger>
            <TabsTrigger value="order">Órdenes</TabsTrigger>
            <TabsTrigger value="delivery">Entregas</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <NotificationList items={notifications} />
          </TabsContent>
          <TabsContent value="stock" className="mt-4">
            <NotificationList items={filterByType("stock")} />
          </TabsContent>
          <TabsContent value="expiry" className="mt-4">
            <NotificationList items={filterByType("expiry")} />
          </TabsContent>
          <TabsContent value="order" className="mt-4">
            <NotificationList items={filterByType("order")} />
          </TabsContent>
          <TabsContent value="delivery" className="mt-4">
            <NotificationList items={filterByType("delivery")} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}