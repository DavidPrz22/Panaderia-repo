import { useQuery } from "@tanstack/react-query";
import { dashBoardDataOptions, DBNotificationOptions } from "./queryOptions";
import { useDashBoardContext } from "@/context/DashBoardContext";

export const useDashBoardData = () => {
    return useQuery(dashBoardDataOptions);
};

export const useDBNotification = () => {
    const { showNotificaciones } = useDashBoardContext();
    return useQuery({...DBNotificationOptions, enabled: showNotificaciones});
};
