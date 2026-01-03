import { useState } from "react";
import {
    ChefHat,
    Wheat,
    Box,
    ShoppingBag,
    TrendingUp,
    FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
    useMateriaPrimaReportQuery,
    useProductosFinalesReportQuery,
    useProductosIntermediosReportQuery,
    useProductosReventaReportQuery,
    useSalesSessionsQuery,
    useSessionDetailQuery,
    useInventorySummaryQuery,
    useSalesSummaryQuery,
} from "../hooks/queries/queries";
import { downloadSalesReportPDF, downloadInventoryReportPDF } from "../api/api";
import { InventoryTable } from "./Inventory/InventoryTable";
import { SalesFilters } from "./Sales/SalesFilters";
import { SalesTable } from "./Sales/SalesTable";
import { SessionDetails } from "./Session/SessionDetails";
import { ReportsMenu } from "./Common/ReportsMenu";
import { ReportViewHeader } from "./Common/ReportViewHeader";
import { downloadBlob, generateFilename } from "../utils/utils";
import type { ReportView, ReportCard } from "../types/types";

const Reportes = () => {
    const [currentView, setCurrentView] = useState<ReportView>("menu");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Summaries
    const { data: inventorySummary } = useInventorySummaryQuery();
    const { data: salesSummary } = useSalesSummaryQuery();

    // Queries (Lazy loaded based on currentView)
    const { data: materiaPrimaData, isLoading: isLoadingMP } = useMateriaPrimaReportQuery(currentView === "materias-primas");
    const { data: productosFinalesData, isLoading: isLoadingPF } = useProductosFinalesReportQuery(currentView === "productos-finales");
    const { data: productosIntermediosData, isLoading: isLoadingPI } = useProductosIntermediosReportQuery(currentView === "productos-intermedios");
    const { data: productosReventaData, isLoading: isLoadingPR } = useProductosReventaReportQuery(currentView === "productos-reventa");
    const { data: salesData, isLoading: isLoadingSales } = useSalesSessionsQuery({
        start_date: startDate || undefined,
        end_date: endDate || undefined,
    }, currentView === "ventas");
    const { data: sessionDetail, isLoading: isLoadingDetail } = useSessionDetailQuery(selectedSessionId);

    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true);
            const blob = await downloadSalesReportPDF({
                start_date: startDate || undefined,
                end_date: endDate || undefined,
            });
            downloadBlob(blob, generateFilename('reporte_ventas'));
        } catch (error) {
            console.error("Error downloading PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadInventoryPDF = async () => {
        try {
            setIsDownloading(true);
            const blob = await downloadInventoryReportPDF(currentView);
            downloadBlob(blob, generateFilename(`reporte_${currentView}`));
        } catch (error) {
            console.error("Error downloading inventory PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSessionClick = (sessionId: number) => {
        setSelectedSessionId(sessionId);
        setIsDetailsOpen(true);
    };

    const reportCards: ReportCard[] = [
        {
            id: "materias-primas",
            title: "Materias Primas",
            description: "Inventario de ingredientes y materiales base",
            icon: Wheat,
            count: inventorySummary?.materias_primas ?? 0,
            color: "text-amber-600"
        },
        {
            id: "productos-finales",
            title: "Productos Finales",
            description: "Productos listos para la venta",
            icon: ChefHat,
            count: inventorySummary?.productos_finales ?? 0,
            color: "text-blue-600"
        },
        {
            id: "productos-intermedios",
            title: "Productos Intermedios",
            description: "Productos en proceso de elaboración",
            icon: Box,
            count: inventorySummary?.productos_intermedios ?? 0,
            color: "text-green-600"
        },
        {
            id: "productos-reventa",
            title: "Productos de Reventa",
            description: "Productos comprados para revender",
            icon: ShoppingBag,
            count: inventorySummary?.productos_reventa ?? 0,
            color: "text-purple-600"
        },
        {
            id: "ventas",
            title: "Ventas por Apertura/Cierre",
            description: "Reportes de ventas por sesión de caja",
            icon: TrendingUp,
            count: salesSummary?.count ?? 0,
            color: "text-primary"
        },
    ];

    const getViewTitle = () => {
        switch (currentView) {
            case "materias-primas": return "Materias Primas";
            case "productos-finales": return "Productos Finales";
            case "productos-intermedios": return "Productos Intermedios";
            case "productos-reventa": return "Productos de Reventa";
            case "ventas": return "Ventas por Apertura/Cierre";
            default: return "Reportes";
        }
    };

    const renderContent = () => {
        if (currentView === "menu") {
            return (
                <ReportsMenu
                    reports={reportCards}
                    onSelectReport={setCurrentView}
                />
            );
        }

        const viewDescription = currentView === "ventas"
            ? "Reporte de ventas por cada apertura y cierre de caja"
            : `Inventario actual de ${getViewTitle().toLowerCase()}`;

        return (
            <Card>
                <ReportViewHeader
                    title={getViewTitle()}
                    description={viewDescription}
                    showDownload={currentView !== "ventas"}
                    onBack={() => setCurrentView("menu")}
                    onDownload={handleDownloadInventoryPDF}
                    isDownloading={isDownloading}
                />
                <CardContent>
                    {currentView === "materias-primas" && (
                        <InventoryTable
                            items={materiaPrimaData}
                            isLoading={isLoadingMP}
                        />
                    )}
                    {currentView === "productos-finales" && (
                        <InventoryTable
                            items={productosFinalesData}
                            showPrice={true}
                            isLoading={isLoadingPF}
                        />
                    )}
                    {currentView === "productos-intermedios" && (
                        <InventoryTable
                            items={productosIntermediosData}
                            isLoading={isLoadingPI}
                        />
                    )}
                    {currentView === "productos-reventa" && (
                        <InventoryTable
                            items={productosReventaData}
                            showPrice={true}
                            isLoading={isLoadingPR}
                        />
                    )}
                    {currentView === "ventas" && (
                        <>
                            <SalesFilters
                                startDate={startDate}
                                endDate={endDate}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                                onDownload={handleDownloadPDF}
                                isDownloading={isDownloading}
                                salesData={salesData}
                            />
                            <SalesTable
                                data={salesData}
                                isLoading={isLoadingSales}
                                onSessionClick={handleSessionClick}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <>
            <div className="flex min-h-screen bg-background">
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
                            </div>
                            <p className="text-muted-foreground">
                                Accede a reportes de inventario y ventas
                            </p>
                        </div>

                        {/* Content */}
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Session Details Sheet */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="sm:max-w-2xl overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Detalles de Sesión</SheetTitle>
                        <SheetDescription>
                            Información completa de la sesión de caja
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        <SessionDetails
                            sessionDetail={sessionDetail}
                            isLoading={isLoadingDetail}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default Reportes;

