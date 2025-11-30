import apiClient from "@/api/client";
import type { DashBoardData } from "../types/types";

export const getDashBoardData = async (): Promise<DashBoardData | null> => {
    try {
        const response = await apiClient.get("/api/core/dashboard/");
        return response.data;
    } catch (error) {
        console.error("Error fetching dashBoardData:", error);
        return null;
    }
};

export const getNotificationData = async () => {
    try {
        const response = await apiClient.get("/api/notificaciones/");
        return response.data;
    } catch (error) {
        console.error("Error fetching notificationData:", error);
        return null;
    }
}