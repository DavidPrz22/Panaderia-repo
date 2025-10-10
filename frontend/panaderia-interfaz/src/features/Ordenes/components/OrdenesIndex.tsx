import { useState } from "react";
import type { Order, OrdenesEstado } from "../types/types";
import { mockOrders } from "../data/mockData";

import { OrdersTable } from "../components/OrdenesTable";
import { OrderDetails } from "../components/OrdenesDetalles";
import { OrderForm } from "../components/OrdenesForm";
import { OrderStatusDialog } from "../components/OrdenesDialogo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrdenesIndex = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [statusDialogOrder, setStatusDialogOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveOrder = (order: Order) => {
    if (orderToEdit) {
      // Update existing order
      setOrders(orders.map((o) => (o.id === order.id ? order : o)));
    } else {
      // Add new order
      setOrders([order, ...orders]);
    }
    setShowForm(false);
    setOrderToEdit(null);
  };

  const handleNewOrder = () => {
    setOrderToEdit(null);
    setShowForm(true);
  };

  const handleEditOrder = (order: Order) => {
    setOrderToEdit(order);
    setShowForm(true);
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId: string, newStatus: OrdenesEstado) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
      )
    );
  };

  const handleQuickStatusChange = (order: Order, newStatus: OrdenesEstado) => {
    handleStatusChange(order.id, newStatus);
  };

  if (showForm) {
    return (
          <OrderForm
            order={orderToEdit || undefined}
            onClose={() => {
              setShowForm(false);
              setOrderToEdit(null);
            }}
            onSave={handleSaveOrder}
          />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Órdenes de Venta</h1>
            <p className="text-muted-foreground">Gestiona las órdenes de tus clientes</p>
          </div>
          <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" onClick={handleNewOrder}>
            <Plus className="h-4 w-4" />
            Nueva Orden
          </Button>
        </div>

        {/* Filters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número de orden o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus-visible:ring-blue-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="En Preparación">En Preparación</SelectItem>
                <SelectItem value="Listo para Entrega">Listo para Entrega</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-sm text-muted-foreground">Total Órdenes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {orders.filter((o) => o.status === "Pendiente").length}
              </div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {orders.filter((o) => o.status === "En Preparación").length}
              </div>
              <p className="text-sm text-muted-foreground">En Preparación</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {orders.filter((o) => o.status === "Entregado").length}
              </div>
              <p className="text-sm text-muted-foreground">Entregados</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <OrdersTable
            orders={filteredOrders}
            onViewOrder={(order) => setSelectedOrder(order)}
            onEditOrder={handleEditOrder}
            onStatusChange={handleQuickStatusChange}
        />

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}

        {/* Status Change Dialog */}
        {statusDialogOrder && (
          <OrderStatusDialog
            order={statusDialogOrder}
            open={!!statusDialogOrder}
            onOpenChange={(open) => !open && setStatusDialogOrder(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
};

export default OrdenesIndex;
