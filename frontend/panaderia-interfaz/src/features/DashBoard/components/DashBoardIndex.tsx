import { DashBoardHeader } from "./DashBoardHeader"
import { DashBoardCards } from "./DashBoardCards"

import { DashBoardGridContainer } from "@/features/DashBoard/components/DashBoardGridContainer";
import { useDashBoardContext } from "@/context/DashBoardContext";

import { DashBoardNotificacionesPanel } from "./DashBoardNotificacionesPanel";
import { useDashBoardData , useDBNotification} from "../hooks/queries/queries";

export const DashBoardIndex = () => {

    const { showNotificaciones } = useDashBoardContext();
    const { data: dbData } = useDashBoardData();
    console.log(dbData);
    const { data: notificaciones } = useDBNotification();
    console.log(notificaciones);
    

    return (
        <div className="px-8 py-8 space-y-6">
            <DashBoardHeader />
            
            {showNotificaciones ? 
            <DashBoardNotificacionesPanel /> : 
            (<>
                    <DashBoardCards />
                    <DashBoardGridContainer />
            </>)
            }
        </div>
    )
}