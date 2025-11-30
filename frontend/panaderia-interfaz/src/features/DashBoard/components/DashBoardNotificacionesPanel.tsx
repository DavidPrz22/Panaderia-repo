import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificacionesFiltro } from "./NotificacionesFiltro";
import type { Notificacion, TipoNotificacion } from "../types/types";
import { NotificationCard } from "./NotificationCard";
import { useDBNotification } from "../hooks/queries/queries";
import { NOTIFICACIONES_TIPOS } from "../utils/constants";

export function DashBoardNotificacionesPanel() {
  const { data: notificaciones } = useDBNotification();


  const filterByType = (tipo_notificacion: TipoNotificacion) => notificaciones!.filter(n => n.tipo_notificacion === tipo_notificacion)
  
  const NotificationList = ({ items }: { items: Notificacion[] }) => (

      <ScrollArea className="h-[72vh]">
        <div className="space-y-3 pr-4">
          {items.map((notification, index) => {
            return <NotificationCard key={index} {...notification} />
          })}
        </div>
      </ScrollArea>
  );

  const handleNotificacionesList = (tipo: TipoNotificacion) => {
    const listaFiltro = filterByType(tipo)

    if (listaFiltro.length === 0) return <div className="text-muted-foreground text-md text-center font-medium">
      Sin notificaciones
    </div>

    return <NotificationList items={listaFiltro} />
  }

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
            <NotificationList items={notificaciones!} />
          </TabsContent>
          <TabsContent value="stock" className="mt-4">
            {handleNotificacionesList(NOTIFICACIONES_TIPOS.STOCK)}
          </TabsContent>
          <TabsContent value="expiracion" className="mt-4">
            {handleNotificacionesList(NOTIFICACIONES_TIPOS.SIN_STOCK)}
          </TabsContent>
          <TabsContent value="orden" className="mt-4">
            {handleNotificacionesList(NOTIFICACIONES_TIPOS.VENCIMIENTO)}
          </TabsContent>
          <TabsContent value="entrega" className="mt-4">
            {handleNotificacionesList(NOTIFICACIONES_TIPOS.ENTREGAS)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}