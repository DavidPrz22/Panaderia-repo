import { useState, useEffect } from "react";
import type { OrdenTable } from "../types/types";

import { OrdersTable } from "../components/OrdenesTable";
import { OrdenDetalles } from "../components/OrdenesDetalles";
import { OrderForm } from "../components/OrdenesForm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllEstadosOrdenVenta } from "../hooks/queries/queries";
import {
  useGetOrdenesDetalles,
  useGetOrdenesTable,
} from "../hooks/queries/queries";
import { useOrdenesContext } from "@/context/OrdenesContext";
import { DoubleSpinnerLoading } from "@/components/DoubleSpinnerLoading";
import { useReducer, useMemo} from "react";

import { Paginator } from "@/components/Paginator";


type PaginatorActions = 'next' | 'previous' | 'base';


const OrdenesIndex = () => {
  const {
    ordenSeleccionadaId,
    showOrdenDetalles,
    showForm,
    setShowForm,
    setShowOrdenDetalles,
    setOrdenSeleccionadaId,
  } = useOrdenesContext();

  const {
    data: ordenesPagination,
    fetchNextPage,
    hasNextPage,
    isFetching: isFetchingOrdenesTable,
    isFetched: isFetchedOrdenesTable,

  } = useGetOrdenesTable();

  const { data: ordenDetalles, isFetched } = useGetOrdenesDetalles(
    ordenSeleccionadaId!,
  );
  
  const [page, setPage] = useReducer((state: number, action: { type: PaginatorActions, payload?: number}) => {
    
    if (action.type === 'next' && ordenesPagination) {

      if (state < ordenesPagination.pages.length - 1) 
        return state + 1;
      
      if (hasNextPage) fetchNextPage();
        return state + 1;
    }
    
    if (action.type === 'previous') {
        return state - 1;
    }
    
    if (action.type === 'base' && ordenesPagination) {

      if (action.payload! > ordenesPagination.pages.length - 1 || action.payload! < 0) {
        if (hasNextPage) fetchNextPage();
        return state + 1;
      }

      return action.payload!;
    }
    
    return state;
        }, 0);
        
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  const { data: estadosOrden } = useGetAllEstadosOrdenVenta();

  useEffect(() => {
    if (ordenSeleccionadaId && isFetched && ordenDetalles && !showForm) {
      setShowOrdenDetalles(true);
    }
  }, [
    ordenSeleccionadaId,
    isFetched,
    setShowOrdenDetalles,
    ordenDetalles,
    showForm,
  ]);

  // Filter orders based on search term and status
  const ordenesTable = ordenesPagination?.pages?.[page]?.results || [];

  const pages_count = useMemo(() => {
    const result_count = ordenesPagination?.pages[0].count || 1;
    const entry_per_page = ordenesPagination?.pages[0].results.length || 1;
    return  Math.round(result_count / entry_per_page);

  }, [isFetchedOrdenesTable]);

  const filteredOrders = (ordenesTable || []).filter((order) => {
    // Search filter: match order ID or client name
    const matchesSearch =
      searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      order.cliente.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "Todos" ||
      order.estado_orden ===
      estadosOrden?.find((e) => e.id.toString() === statusFilter)
        ?.nombre_estado;

    return matchesSearch && matchesStatus;
  });

  const handleNewOrder = () => {
    setShowForm(true);
    setOrdenSeleccionadaId(null);
  };

  const handleEditOrder = (order: OrdenTable) => {
    setShowOrdenDetalles(false);
    setOrdenSeleccionadaId(order.id);
    setShowForm(true);
  };

  if (showOrdenDetalles) {
    return (
      <OrdenDetalles
        orden={ordenDetalles!}
        onClose={() => {
          setShowOrdenDetalles(false);
          setOrdenSeleccionadaId(null);
        }}
      />
    );
  }

  if (showForm) {
    if (!ordenSeleccionadaId || ordenDetalles) {
      const ordenToEdit = ordenSeleccionadaId ? ordenDetalles : undefined;
      return (
        <OrderForm
          order={ordenToEdit}
          onClose={() => {
            setShowForm(false);
            setOrdenSeleccionadaId(null);
          }}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-background mx-8 py-5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Órdenes de Venta
            </h1>
            <p className="text-muted-foreground">
              Gestiona las órdenes de tus clientes
            </p>
          </div>
          <Button
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            onClick={handleNewOrder}
          >
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
                  <SelectItem key={estado.id} value={estado.id.toString()}>
                    {estado.nombre_estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{ordenesTable?.length}</div>
              <p className="text-sm text-muted-foreground">Total Órdenes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {
                  ordenesTable?.filter((o) => o.estado_orden === "Pendiente")
                    .length
                }
              </div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {
                  ordenesTable?.filter(
                    (o) => o.estado_orden === "En Preparación",
                  ).length
                }
              </div>
              <p className="text-sm text-muted-foreground">En Preparación</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {
                  ordenesTable?.filter((o) => o.estado_orden === "Completado")
                    .length
                }
              </div>
              <p className="text-sm text-muted-foreground">Completados</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        {isFetchingOrdenesTable ? (
          <DoubleSpinnerLoading extraClassName="size-20" />
        ) : (
          <>
            <OrdersTable orders={filteredOrders} onEditOrder={handleEditOrder} />
            {pages_count > 1 && (
              <Paginator 
                    previousPage={page > 0} 
                    nextPage={ hasNextPage || page < pages_count - 1} 
                    pages={Array.from({ length: pages_count}, (_, i) => i + 1)}
                    currentPage={page + 1}
                    onClickPrev={() => setPage({type:'previous'})}
                    onClickPage={(p) => setPage({type:'base', payload: p - 1})}
                    onClickNext={() => setPage({type:'next'})}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdenesIndex;
