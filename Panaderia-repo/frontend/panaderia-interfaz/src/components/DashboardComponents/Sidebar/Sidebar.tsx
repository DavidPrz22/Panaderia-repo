import SidbarTitle from "./SidbarTitle";
import SidebarCard from "./SidebarCard";
import { useRef } from "react";
import SidebarDropdownCard from "./SidebarDropdownCard";
import { SIDEBAR_WIDTH } from "@/lib/constants";

export default function Sidebar() {
  const ref = useRef<HTMLDivElement>(null);
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (ref.current) {
      ref.current.classList.toggle("bg-white/20");
    }
    ref.current = e.currentTarget;
    ref.current.classList.toggle("bg-white/20");
  }

  return (
    <>
      <div
        className={`flex flex-col h-screen bg-blue-900 w-[${SIDEBAR_WIDTH}] fixed top-0 left-0`}
      >
        <SidbarTitle />
        <div className="flex flex-col justify-between h-full p-2 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <SidebarCard
              icon="/DashboardAssets/dashboard.svg"
              onclick={handleClick}
            >
              Dashboard
            </SidebarCard>
            <SidebarCard
              icon="/DashboardAssets/MateriaPrima.svg"
              onclick={handleClick}
              link="/dashboard/materia-prima"
            >
              Materia Prima
            </SidebarCard>

            <SidebarDropdownCard
              icon="/DashboardAssets/Productos.svg"
              elements={[
                {
                  url: "/DashboardAssets/Intermedios.svg",
                  title: "Intermedios",
                },
                { url: "/DashboardAssets/Reventa.svg", title: "Reventa" },
              ]}
              onclick={handleClick}
            >
              Productos
            </SidebarDropdownCard>

            <SidebarDropdownCard
              icon="/DashboardAssets/Venta.svg"
              elements={[
                {
                  url: "/DashboardAssets/Clientes.svg",
                  title: "Clientes",
                  link: "/dashboard/clientes",
                },
                { url: "/DashboardAssets/Pedidos.svg", title: "Pedidos" },
                {
                  url: "/DashboardAssets/PuntoVenta.svg",
                  title: "Punto de Venta",
                },
              ]}
              onclick={handleClick}
            >
              Ventas
            </SidebarDropdownCard>

            <SidebarCard
              icon="/DashboardAssets/Recetas.svg"
              onclick={handleClick}
            >
              Recetas
            </SidebarCard>
            <SidebarCard
              icon="/DashboardAssets/Production.svg"
              onclick={handleClick}
            >
              Producción
            </SidebarCard>
            <SidebarCard
              icon="/DashboardAssets/Compras.svg"
              onclick={handleClick}
            >
              Compras
            </SidebarCard>
            <SidebarCard
              icon="/DashboardAssets/Reportes.svg"
              onclick={handleClick}
            >
              Reportes
            </SidebarCard>
          </div>
        </div>
      </div>
    </>
  );
}
