import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificacionesFiltro } from "./NotificacionesFiltro";
import type { Notification } from "../types/types";
import { NotificationCard } from "./NotificationCard";

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
    id: "1",
    type: "stock",
    title: "Stock Bajo",
    message: "Harina de Trigo está por debajo del punto de reorden (15kg disponible)",
    time: "Hace 5 min",
    priority: "high",
  },
  {
    id: "1",
    type: "stock",
    title: "Stock Bajo",
    message: "Harina de Trigo está por debajo del punto de reorden (15kg disponible)",
    time: "Hace 5 min",
    priority: "high",
  },
  {
    id: "1",
    type: "stock",
    title: "Stock Bajo",
    message: "Harina de Trigo está por debajo del punto de reorden (15kg disponible)",
    time: "Hace 5 min",
    priority: "high",
  },
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
    type: "expiracion",
    title: "Lote por Vencer",
    message: "Lote Leche #L2401 vence en 2 días (25 litros)",
    time: "Hace 15 min",
    priority: "high",
  },
  {
    id: "3",
    type: "entrega",
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
    type: "orden",
    title: "Orden Pendiente",
    message: "Orden de compra OC-103 pendiente de confirmación",
    time: "Hace 3 horas",
    priority: "low",
  },
  {
    id: "6",
    type: "expiracion",
    title: "Lote por Vencer",
    message: "Lote Huevos #H1523 vence en 3 días (120 unidades)",
    time: "Hace 4 horas",
    priority: "medium",
  },
];


export function DashBoardNotificacionesPanel() {
  const filterByType = (type?: string) => 
    type ? notifications.filter(n => n.type === type) : notifications;

  const NotificationList = ({ items }: { items: Notification[] }) => (

      <ScrollArea className="h-[72vh]">
        <div className="space-y-3 pr-4">
          {items.map((notification, index) => {
            return <NotificationCard key={index} {...notification} />
          })}
        </div>
      </ScrollArea>
  );

  return (
    <Card className="border border-gray-300 shadow-xs font-[Roboto]">
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

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-10">
            <TabsTrigger value="todos" className="cursor-pointer">Todas</TabsTrigger>
            <TabsTrigger value="stock" className="cursor-pointer">Stock</TabsTrigger>
            <TabsTrigger value="expiracion" className="cursor-pointer">Vencimiento</TabsTrigger>
            <TabsTrigger value="orden" className="cursor-pointer">Órdenes</TabsTrigger>
            <TabsTrigger value="entrega" className="cursor-pointer">Entregas</TabsTrigger>
          </TabsList>
          <TabsContent value="todos" className="mt-4">
            <NotificationList items={notifications} />
          </TabsContent>
          <TabsContent value="stock" className="mt-4">
            <NotificationList items={filterByType("stock")} />
          </TabsContent>
          <TabsContent value="expiracion" className="mt-4">
            <NotificationList items={filterByType("expiracion")} />
          </TabsContent>
          <TabsContent value="orden" className="mt-4">
            <NotificationList items={filterByType("orden")} />
          </TabsContent>
          <TabsContent value="entrega" className="mt-4">
            <NotificationList items={filterByType("entrega")} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}