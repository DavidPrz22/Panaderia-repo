export type Notification = {
  id: string;
  type: "stock" | "expiracion" | "orden" | "entrega";
  title: string;
  message: string;
  time: string;
  priority: "high" | "medium" | "low";
}
