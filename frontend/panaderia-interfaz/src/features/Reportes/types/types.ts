export type ReportView =
    | "menu"
    | "materias-primas"
    | "productos-finales"
    | "productos-intermedios"
    | "productos-reventa"
    | "ventas";

export type {
    InventoryItem,
    InventoryReport,
    InventorySummary,
    SessionReport,
    SalesReport,
    SalesSummary,
    SessionDetail,
    TransaccionVenta,
    ItemVendido
} from "../schemas/schemas";

export interface ReportCard {
    id: ReportView;
    title: string;
    description: string;
    icon: React.ElementType; // lucide-react icons
    count: number;
    color: string;
}
