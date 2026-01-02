import {
    Package,
    Wheat,
    Box,
    ShoppingBag,
    TrendingUp,
    FileText,
    ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useReportesContext } from "@/context/ReportesContext";

// Mock data for inventory reports
const materiasPrimas = [
    { id: 1, name: "Harina de Trigo", unit: "kg", stock: 150, minStock: 50, lastUpdated: "2024-01-15" },
    { id: 2, name: "Azúcar", unit: "kg", stock: 80, minStock: 30, lastUpdated: "2024-01-14" },
    { id: 3, name: "Mantequilla", unit: "kg", stock: 25, minStock: 20, lastUpdated: "2024-01-15" },
    { id: 4, name: "Huevos", unit: "unidad", stock: 200, minStock: 100, lastUpdated: "2024-01-15" },
    { id: 5, name: "Leche", unit: "litro", stock: 45, minStock: 40, lastUpdated: "2024-01-14" },
];

const productosFinales = [
    { id: 1, name: "Pan Francés", unit: "unidad", stock: 50, minStock: 20, price: 0.25, lastUpdated: "2024-01-15" },
    { id: 2, name: "Croissant", unit: "unidad", stock: 30, minStock: 15, price: 1.50, lastUpdated: "2024-01-15" },
    { id: 3, name: "Torta de Chocolate", unit: "unidad", stock: 5, minStock: 3, price: 25.00, lastUpdated: "2024-01-14" },
    { id: 4, name: "Empanada de Carne", unit: "unidad", stock: 40, minStock: 25, price: 2.00, lastUpdated: "2024-01-15" },
];

const productosIntermedios = [
    { id: 1, name: "Masa Base", unit: "kg", stock: 20, minStock: 10, lastUpdated: "2024-01-15" },
    { id: 2, name: "Crema Pastelera", unit: "kg", stock: 8, minStock: 5, lastUpdated: "2024-01-14" },
    { id: 3, name: "Merengue", unit: "kg", stock: 5, minStock: 3, lastUpdated: "2024-01-15" },
];

const productosReventa = [
    { id: 1, name: "Gaseosa 500ml", unit: "unidad", stock: 48, minStock: 24, price: 1.50, lastUpdated: "2024-01-15" },
    { id: 2, name: "Agua Mineral", unit: "unidad", stock: 36, minStock: 20, price: 1.00, lastUpdated: "2024-01-14" },
    { id: 3, name: "Jugo Natural", unit: "unidad", stock: 15, minStock: 10, price: 2.50, lastUpdated: "2024-01-15" },
];

// Mock data for sales reports
const salesBySession = [
    {
        id: 1,
        date: "2024-01-15",
        openTime: "06:00",
        closeTime: "14:00",
        initialCash: 100.00,
        totalSales: 485.50,
        cashSales: 320.00,
        cardSales: 165.50,
        transactions: 45,
        cashier: "María García"
    },
    {
        id: 2,
        date: "2024-01-15",
        openTime: "14:00",
        closeTime: "22:00",
        initialCash: 150.00,
        totalSales: 620.75,
        cashSales: 450.25,
        cardSales: 170.50,
        transactions: 58,
        cashier: "Carlos López"
    },
    {
        id: 3,
        date: "2024-01-14",
        openTime: "06:00",
        closeTime: "14:00",
        initialCash: 100.00,
        totalSales: 398.25,
        cashSales: 280.00,
        cardSales: 118.25,
        transactions: 38,
        cashier: "María García"
    },
    {
        id: 4,
        date: "2024-01-14",
        openTime: "14:00",
        closeTime: "22:00",
        initialCash: 150.00,
        totalSales: 512.00,
        cashSales: 380.00,
        cardSales: 132.00,
        transactions: 52,
        cashier: "Ana Martínez"
    },
];

const Reportes = () => {
    const { currentView, setCurrentView } = useReportesContext();

    const getStockBadge = (stock: number, minStock: number) => {
        if (stock <= minStock * 0.5) {
            return <Badge variant="destructive">Crítico</Badge>;
        } else if (stock <= minStock) {
            return <Badge className="bg-orange-500 hover:bg-orange-600">Bajo</Badge>;
        }
        return <Badge className="bg-accent hover:bg-accent/90">OK</Badge>;
    };

    const renderInventoryTable = (items: any[], showPrice = false) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Stock Mín.</TableHead>
                    {showPrice && <TableHead className="text-right">Precio</TableHead>}
                    <TableHead>Estado</TableHead>
                    <TableHead>Última Actualización</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-right">{item.stock}</TableCell>
                        <TableCell className="text-right">{item.minStock}</TableCell>
                        {showPrice && 'price' in item && (
                            <TableCell className="text-right">${(item as { price: number }).price.toFixed(2)}</TableCell>
                        )}
                        <TableCell>{getStockBadge(item.stock, item.minStock)}</TableCell>
                        <TableCell className="text-muted-foreground">{item.lastUpdated}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    const renderSalesTable = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Cajero</TableHead>
                    <TableHead className="text-right">Efectivo Inicial</TableHead>
                    <TableHead className="text-right">Ventas Efectivo</TableHead>
                    <TableHead className="text-right">Ventas Tarjeta</TableHead>
                    <TableHead className="text-right">Total Ventas</TableHead>
                    <TableHead className="text-right">Transacciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {salesBySession.map((session) => (
                    <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.date}</TableCell>
                        <TableCell>{session.openTime} - {session.closeTime}</TableCell>
                        <TableCell>{session.cashier}</TableCell>
                        <TableCell className="text-right">${session.initialCash.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${session.cashSales.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${session.cardSales.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold">${session.totalSales.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{session.transactions}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    const reportCards = [
        {
            id: "materias-primas" as const,
            title: "Materias Primas",
            description: "Inventario de ingredientes y materiales base",
            icon: Wheat,
            count: materiasPrimas.length,
            color: "text-amber-600"
        },
        {
            id: "productos-finales" as const,
            title: "Productos Finales",
            description: "Productos listos para la venta",
            icon: Package,
            count: productosFinales.length,
            color: "text-accent"
        },
        {
            id: "productos-intermedios" as const,
            title: "Productos Intermedios",
            description: "Productos en proceso de elaboración",
            icon: Box,
            count: productosIntermedios.length,
            color: "text-blue-600"
        },
        {
            id: "productos-reventa" as const,
            title: "Productos de Reventa",
            description: "Productos comprados para revender",
            icon: ShoppingBag,
            count: productosReventa.length,
            color: "text-purple-600"
        },
        {
            id: "ventas" as const,
            title: "Ventas por Apertura/Cierre",
            description: "Reportes de ventas por sesión de caja",
            icon: TrendingUp,
            count: salesBySession.length,
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportCards.map((report) => (
                        <Card
                            key={report.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                            onClick={() => setCurrentView(report.id)}
                        >
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className={`p-3 rounded-lg bg-muted ${report.color}`}>
                                    <report.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{report.title}</CardTitle>
                                    <CardDescription>{report.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    <span>{report.count} registros</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            );
        }

        return (
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentView("menu")}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <CardTitle>{getViewTitle()}</CardTitle>
                        <CardDescription>
                            {currentView === "ventas"
                                ? "Reporte de ventas por cada apertura y cierre de caja"
                                : `Inventario actual de ${getViewTitle().toLowerCase()}`
                            }
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {currentView === "materias-primas" && renderInventoryTable(materiasPrimas)}
                    {currentView === "productos-finales" && renderInventoryTable(productosFinales, true)}
                    {currentView === "productos-intermedios" && renderInventoryTable(productosIntermedios)}
                    {currentView === "productos-reventa" && renderInventoryTable(productosReventa, true)}
                    {currentView === "ventas" && renderSalesTable()}
                </CardContent>
            </Card>
        );
    };

    return (
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
    );
};

export default Reportes;
