import SidbarTitle from "./SidbarTitle";
import SidebarCard from "./SidebarCard";
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
  FinalesIcon,
  TransformacionIcon,
} from "@/assets/DashboardAssets";



export default function Sidebar() {
  const {
    setSelectedModule,
    refCard,
    setIsOpenDropdownCard,
    isOpenDropdownCard,
  } = useAppContext();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (refCard.current) {
      refCard.current.classList.remove("bg-white/20");
    }

    const currentTarget = e.currentTarget;
    const currentId = currentTarget.id;

    refCard.current = currentTarget;
    refCard.current.classList.add("bg-white/20");
    setSelectedModule(currentId);

    if (
      isOpenDropdownCard &&
      !currentTarget.closest('[data-id="DropdownContainer"]')
    ) {
      setIsOpenDropdownCard(false);
    }
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
                  icon: FinalesIcon,
                  title: "Finales",
                  id: "finales",
                  link: "/dashboard/productos-finales",
                },
                {
                  icon: IntermediosIcon,
                  title: "Intermedios",
                  id: "intermedios",
                  link: "/dashboard/productos-intermedios",
                },
                {
                  icon: ReventaIcon,
                  title: "Reventa",
                  id: "reventa",
                  link: "/dashboard/productos-reventa",
                },
              ]}
              onclick={handleClick}
              id="productos"
            >
              Productos
            </SidebarDropdownCard>

            <SidebarDropdownCard
              icon={VentaIcon}
              elements={[
                {
                  icon: ClientesIcon,
                  title: "Clientes",
                  id: "clientes",
                },
                {
                  icon: PedidosIcon,
                  title: "Pedidos",
                  id: "pedidos",
                  link: "/dashboard/pedidos",
                },
                {
                  icon: PuntoVentaIcon,
                  title: "Punto de Venta",
                  id: "punto-venta",
                },
              ]}
              onclick={handleClick}
              id="ventas"
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
              link="/dashboard/produccion"
            >
              Producción
            </SidebarCard>
            <SidebarCard icon={TransformacionIcon} onclick={handleClick} id="transformacion">
              Transformación
            </SidebarCard>
            <SidebarCard 
              icon={ComprasIcon} 
              onclick={handleClick} 
              id="compras"
              link="/dashboard/compras"
            >
              Compras
            </SidebarCard>
            <SidebarCard
              icon={ReportesIcon}
              onclick={handleClick}
              id="reportes"
              link="/dashboard/shadcn"
            >
              Reportes
            </SidebarCard>
          </div>
        </div>
      </div>
    </>
  );
}
