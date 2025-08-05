import SidbarTitle from "./SidbarTitle";
import SidebarCard from "./SidebarCard";
import { useRef } from "react";
import SidebarDropdownCard from "./SidebarDropdownCard";
import { useAppContext } from "@/context/AppContext";
import {
  DashboardIcon,
  MateriaPrimaIcon,
  ProductosIcon,
  IntermediosIcon,
  ReventaIcon,
  VentaIcon,
  ClientesIcon,
  PedidosIcon,
  PuntoVentaIcon,
  RecetasIcon,
  ProductionIcon,
  ComprasIcon,
  ReportesIcon,
} from "@/assets/DashboardAssets";

export default function Sidebar() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setSelectedModule } = useAppContext();
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (ref.current) {
      ref.current.classList.toggle("bg-white/20");
    }
    ref.current = e.currentTarget;
    ref.current.classList.toggle("bg-white/20");
    setSelectedModule(e.currentTarget.id);
  }

  return (
    <>
      <div
        className={`flex flex-col h-screen bg-blue-900 w-(--sidebar-width) fixed top-0 left-0`}
      >
        <SidbarTitle />
        <div className="flex flex-col justify-between h-full p-2 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <SidebarCard
              icon={DashboardIcon}
              onclick={handleClick}
              link="/dashboard"
              id="dashboard"
            >
              Dashboard
            </SidebarCard>
            <SidebarCard
              icon={MateriaPrimaIcon}
              onclick={handleClick}
              link="/dashboard/materia-prima"
              id="materia-prima"
            >
              Materia Prima
            </SidebarCard>

            <SidebarDropdownCard
              icon={ProductosIcon}
              elements={[
                {
                  url: IntermediosIcon,
                  title: "Intermedios",
                  id: "intermedios",
                  link: "/dashboard/productos-intermedios",
                },
                {
                  url: ReventaIcon,
                  title: "Reventa",
                  id: "reventa",
                },
              ]}
              onclick={handleClick}
            >
              Productos
            </SidebarDropdownCard>

            <SidebarDropdownCard
              icon={VentaIcon}
              elements={[
                {
                  url: ClientesIcon,
                  title: "Clientes",
                  id: "clientes",
                },
                {
                  url: PedidosIcon,
                  title: "Pedidos",
                  id: "pedidos",
                },
                {
                  url: PuntoVentaIcon,
                  title: "Punto de Venta",
                  id: "punto-venta",
                },
              ]}
              onclick={handleClick}
            >
              Ventas
            </SidebarDropdownCard>

            <SidebarCard 
            icon={RecetasIcon} 
            onclick={handleClick} 
            id="recetas"
            link="/dashboard/recetas"
            >
              Recetas
            </SidebarCard>
            <SidebarCard
              icon={ProductionIcon}
              onclick={handleClick}
              id="produccion"
            >
              Producción
            </SidebarCard>
            <SidebarCard icon={ComprasIcon} onclick={handleClick} id="compras">
              Compras
            </SidebarCard>
            <SidebarCard
              icon={ReportesIcon}
              onclick={handleClick}
              id="reportes"
            >
              Reportes
            </SidebarCard>
          </div>
        </div>
      </div>
    </>
  );
}
