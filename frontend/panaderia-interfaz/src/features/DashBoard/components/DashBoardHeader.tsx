import { Button } from "@/components/ui/button";
import { BellRingIcon, LayoutDashboardIcon } from "lucide-react";
import { useDashBoardContext } from "@/context/DashBoardContext";
import { useDashBoardData, useDBNotification } from "../hooks/queries/queries";

export const DashBoardHeader = () => {
  const { setShowNotificaciones, showNotificaciones } = useDashBoardContext();
  const { data: dashboardData } = useDashBoardData();
  const {
    isFetching: isNotificationFetching,
    isFetched: isNotificationFetched,
  } = useDBNotification();

  const handleNotificacionesClick = () => {
    setShowNotificaciones(!showNotificaciones);
  };

  return (
    <div className="flex justify-between items-center ">
      <h1 className="text-2xl font-bold">Panel de Control</h1>
      {showNotificaciones && isNotificationFetched ? (
        <Button
          onClick={handleNotificacionesClick}
          size="lg"
          variant={"outline"}
          className="cursor-pointer font-semibold hover:bg-blue-500 hover:text-white tracking-wide hover:border-transparent"
        >
          <LayoutDashboardIcon className="size-5 mr-1" />
          Dashboard
        </Button>
      ) : (
        <Button
          onClick={handleNotificacionesClick}
          size="lg"
          variant={"outline"}
          className="cursor-pointer  font-semibold hover:bg-blue-500 hover:text-white tracking-wide hover:border-transparent"
        >
          <BellRingIcon className="size-5 mr-1" />
          {isNotificationFetching ? (
            "Cargando Notificaciones..."
          ) : dashboardData?.notificaciones &&
            Number(dashboardData.notificaciones) > 0 ? (
            <>
              <span className="bg-red-500 text-white py-0.5 px-1 rounded-full text-xs">
                {dashboardData.notificaciones}
              </span>
              Notificaciones
            </>
          ) : (
            "Notificaciones"
          )}
        </Button>
      )}
    </div>
  );
};
