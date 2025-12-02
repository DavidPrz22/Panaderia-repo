import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificacionesFiltro } from "./NotificacionesFiltro";
import type { Notificacion, TipoNotificacion, TipoProducto } from "../types/types";
import { NotificationCard } from "./NotificationCard";
import { useDBNotification } from "../hooks/queries/queries";
import { NOTIFICACIONES_TIPOS } from "../utils/constants";

import { useState } from "react";

const NoNotification = () => (<div className=" text-muted-foreground text-md text-center font-medium py-10">Ninguna Notificación</div>)

export function DashBoardNotificacionesPanel() {

  const TODOS = 'TODOS'
  const { data } = useDBNotification();
  const notificaciones = data?.notificaciones ?? [];
  const [filtroTipoProducto, setFiltroTipoProducto] = useState<TipoProducto>(TODOS);

  const filterByType = (tipo_notificacion?: TipoNotificacion) => {

    if (!tipo_notificacion) return notificaciones.filter(n => filtroTipoProducto === TODOS ? true : n.tipo_producto === filtroTipoProducto)

    return notificaciones.filter(n => {
      const tipo = n.tipo_notificacion === tipo_notificacion
      const producto = filtroTipoProducto === TODOS ? true : n.tipo_producto === filtroTipoProducto
      return tipo && producto
    })
  }

  const NotificationList = ({ items }: { items: Notificacion[] }) => {
    if (items.length === 0) {
      return <NoNotification />;
    }

    return (
      <ScrollArea className="h-[72vh]">
        <div className="space-y-3 pr-4">
          {items.map((notification, index) => (
            <NotificationCard key={index} {...notification} />
          ))}
        </div>
      </ScrollArea>
    );
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
            <NotificacionesFiltro id="notificaciones-filtro" placeholder="Selecciona un tipo" value={filtroTipoProducto} onChange={(v) => setFiltroTipoProducto(v as TipoProducto)} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-10">
            <TabsTrigger value="todos" className="cursor-pointer">Todas</TabsTrigger>
            <TabsTrigger value="stock" className="cursor-pointer">Bajo stock</TabsTrigger>
            <TabsTrigger value="nostock" className="cursor-pointer">Sin stock</TabsTrigger>
            <TabsTrigger value="expiracion" className="cursor-pointer">Vencimiento</TabsTrigger>
            <TabsTrigger value="entrega" className="cursor-pointer">Entregas</TabsTrigger>
          </TabsList>
          <TabsContent value="todos" className="mt-4">
            <NotificationList items={filterByType()} />
          </TabsContent>
          <TabsContent value="stock" className="mt-4">
            <NotificationList items={filterByType(NOTIFICACIONES_TIPOS.STOCK)} />
          </TabsContent>
          <TabsContent value="nostock" className="mt-4">
            <NotificationList items={filterByType(NOTIFICACIONES_TIPOS.SIN_STOCK)} />
          </TabsContent>
          <TabsContent value="expiracion" className="mt-4">
            <NotificationList items={filterByType(NOTIFICACIONES_TIPOS.VENCIMIENTO)} />
          </TabsContent>
          <TabsContent value="entrega" className="mt-4">
            <NotificationList items={filterByType(NOTIFICACIONES_TIPOS.ENTREGAS)} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}