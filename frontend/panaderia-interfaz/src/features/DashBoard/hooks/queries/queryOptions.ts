import {
  getDashBoardData,
  getNotificationData,
} from "@/features/DashBoard/api/api";

export const dashBoardDataOptions = {
  queryKey: ["dashBoardData"],
  queryFn: getDashBoardData,
  staleTime: Infinity,
};

export const DBNotificationOptions = {
  queryKey: ["notificaciones"],
  queryFn: getNotificationData,
  staleTime: Infinity,
};
