import { DashBoardHeader } from "./DashBoardHeader";
import { DashBoardCards } from "./DashBoardCards";

import { DashBoardGridContainer } from "@/features/DashBoard/components/DashBoardGridContainer";
import { useDashBoardContext } from "@/context/DashBoardContext";

import { DashBoardNotificacionesPanel } from "./DashBoardNotificacionesPanel";
import { useDBNotification } from "../hooks/queries/queries";

export const DashBoardIndex = () => {
  const { showNotificaciones } = useDashBoardContext();
  const { isFetched: isNotificationFetched } = useDBNotification();

  return (
    <div className="px-8 py-8 space-y-6">
      <DashBoardHeader />

      {showNotificaciones && isNotificationFetched ? (
        <DashBoardNotificacionesPanel />
      ) : (
        <>
          <DashBoardCards />
          <DashBoardGridContainer />
        </>
      )}
    </div>
  );
};
