import { useComprasContext } from "@/context/ComprasContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { OrdenCompraTable } from "../types/types";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { DoubleSpinnerLoading } from "@/components/DoubleSpinnerLoading";

import { 
  useGetAllEstadosOrdenCompra, 
  useGetOrdenesCompraTable,
  useGetOrdenesCompraDetalles 
} from "../hooks/queries/queries";
import { DoubleSpinnerLoading } from "@/components/DoubleSpinnerLoading";
import { ComprasTable } from "./ComprasTable";
import { ComprasForm } from "./ComprasForma";
import { ComprasDetalles } from "./ComprasDetalles";

export const ComprasIndex = () => {
    const { compraSeleccionadaId, showOrdenCompraDetalles, ordenCompra, setOrdenCompra, showForm, setShowForm, setShowOrdenCompraDetalles, setCompraSeleccionadaId } = useComprasContext();
  
  const { data: ordenesCompraTable = [], isFetching: isFetchingOrdenesCompraTable } = useGetOrdenesCompraTable();
  const { data: { orden: compraDetalles } = { orden: undefined }, isFetched } = useGetOrdenesCompraDetalles(compraSeleccionadaId!);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  const { data: estadosOrden } = useGetAllEstadosOrdenCompra();

  useEffect(() => {
    if (compraSeleccionadaId && isFetched && compraDetalles && !showForm) {
      setShowOrdenCompraDetalles(true);
      setOrdenCompra(compraDetalles);
    }
  }, [compraSeleccionadaId, isFetched, setShowOrdenCompraDetalles, setOrdenCompra, compraDetalles, showForm]);


  useEffect(() => {
    if (ordenCompra && compraSeleccionadaId && !showForm) {
      setShowOrdenCompraDetalles(true);
    }
  }, [ordenCompra, showForm, setShowOrdenCompraDetalles, compraSeleccionadaId]);


  // Filter orders based on search term and status
  const filteredOrders = (ordenesCompraTable).filter((order) => {
    // Search filter: match order ID or provider name
    const matchesSearch = searchTerm === "" || 
      order.id.toString().includes(searchTerm) ||
      order.proveedor.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === "Todos" ||
      order.estado_oc === estadosOrden?.find(e => e.id.toString() === statusFilter)?.nombre_estado;

    return matchesSearch && matchesStatus;
  });

  const handleNewOrder = () => {
    setShowForm(true);
    setCompraSeleccionadaId(null);
  };

  const handleEditOrder = (order: OrdenCompraTable) => {
    setShowOrdenCompraDetalles(false);
    setCompraSeleccionadaId(order.id);
    setShowForm(true);
  };


  if (showOrdenCompraDetalles && ordenCompra) {
    return (
      <ComprasDetalles 
        ordenCompra={ordenCompra} 
        onClose={() => {
          setShowOrdenCompraDetalles(false);
          setCompraSeleccionadaId(null);
        }}  
      />
    );
  }

  if (showForm) {
  
    if (!compraSeleccionadaId || compraDetalles) {
      const compraToEdit = compraSeleccionadaId ? compraDetalles : undefined;
      return (
            <ComprasForm
              orden={compraToEdit}
              onClose={() => {
                  setShowForm(false);
                  setCompraSeleccionadaId(null);
              }}
            />
      );
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Órdenes de Compra</h1>
            <p className="text-muted-foreground">Gestiona las órdenes de compra a proveedores</p>
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
                placeholder="Buscar por número de orden o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus-visible:ring-blue-200 bg-gray-50"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-50">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {estadosOrden?.map((estado) => (
                  <SelectItem key={estado.id} value={estado.id.toString()}>{estado.nombre_estado}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{ordenesCompraTable?.length}</div>
              <p className="text-sm text-muted-foreground">Total Órdenes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {ordenesCompraTable?.filter((o) => o.estado_oc === "Borrador").length}
              </div>
              <p className="text-sm text-muted-foreground">Borrador</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {ordenesCompraTable?.filter((o) => o.estado_oc === "Enviada").length}
              </div>
              <p className="text-sm text-muted-foreground">Enviada</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {ordenesCompraTable?.filter((o) => o.estado_oc === "Recibida Completa").length}
              </div>
              <p className="text-sm text-muted-foreground">Recibida Completa</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
          {isFetchingOrdenesCompraTable ? (
          <DoubleSpinnerLoading extraClassName="size-20" />
        ) : (
          <ComprasTable
            ordenesCompra={filteredOrders}
            onEditOrder={handleEditOrder}
          />
        )} 

      </div>
    </div>
  );
};