import { DashBoardHeader } from "./DashBoardHeader"
import { DashBoardCards } from "./DashBoardCards"

import { DashBoardGridContainer } from "@/features/DashBoard/components/DashBoardGridContainer";
import { useDashBoardContext } from "@/context/DashBoardContext";

import { DashBoardNotificacionesPanel } from "./DashBoardNotificacionesPanel";

export const DashBoardIndex = () => {

    const { showNotificaciones } = useDashBoardContext();

    return (
        <div className="px-8 py-8 space-y-6">
            <DashBoardHeader />
            
            {showNotificaciones ? 
            <DashBoardNotificacionesPanel /> : 
            (
                <>
                    <DashBoardCards />
                    <DashBoardGridContainer />
                </>
            )
            }
        </div>
    )
}