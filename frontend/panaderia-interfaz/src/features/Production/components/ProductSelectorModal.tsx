import { useState, useMemo } from "react";
import { Search, X, Package } from "lucide-react";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProductSearchQueries } from "../hooks/queries/ProductionQueries";
import { useProductionContext } from "@/context/ProductionContext";
import type { searchItem } from "../types/types";

interface ProductSelectorModalProps {
    onSelectProduct: (product: searchItem) => void;
}

export const ProductSelectorModal = ({
    onSelectProduct,
}: ProductSelectorModalProps) => {

    const [finalesResult, intermediosResult] = useProductSearchQueries();
    const finales = finalesResult.data;
    const intermedios = intermediosResult.data;

    const {
        productType,
    } = useProductionContext();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const isLoading = productType === "producto-final" ? finalesResult.isLoading : intermediosResult.isLoading;

    const productosDisponibles = useMemo(
        () => productType === "producto-final" ? finales : intermedios,
        [productType, finales, intermedios]
    );

    const categoriasProducto = useMemo(() => {
        const baseData = productType === "producto-final" ? finales : intermedios;
        if (!baseData) return ["Todos"];

        const uniqueCategories = [...new Set(baseData.map((item) => item.categoria))];
        return ["Todos", ...uniqueCategories];
    }, [productType, finales, intermedios]);

    const filteredProducts = useMemo(() => {

        if (!productosDisponibles) return [];

        return productosDisponibles.filter((product) => {
            const matchesSearch = product.nombre_producto
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === "Todos" || product.categoria === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, productType, selectedCategory, finales, intermedios]);


    const handleSelectProduct = (product: searchItem) => {
        onSelectProduct(product);
        setSearchTerm("");
        setSelectedCategory("Todos");
    };

    return (
        <DialogContent className="min-w-[75%] max-h-[85vh] h-[85vh] flex flex-col overflow-hidden">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Seleccionar Producto
                </DialogTitle>
            </DialogHeader>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 focus-visible:ring-blue-100 focus-visible:border-blue-300"

                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2">
                {categoriasProducto!.map((categoria) => (
                    <Badge
                        key={categoria}
                        variant={selectedCategory === categoria ? "default" : "outline"}
                        className="cursor-pointer transition-colors px-3 py-2 font-semibold hover:bg-primary/80 hover:text-primary-foreground"
                        onClick={() => setSelectedCategory(categoria)}
                    >
                        {categoria}
                    </Badge>
                ))}
            </div>

            {/* Products Grid/List */}
            <ScrollArea className="flex-1 mt-4 pr-4 overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                        <p>Cargando productos...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                        <Package className="h-12 w-12 mb-4 opacity-50" />
                        <p>No se encontraron productos</p>
                        <p className="text-sm">
                            Intenta con otra búsqueda o categoría
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleSelectProduct(product)}
                                className="p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-800 hover:bg-blue-50 hover:shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-blue-200 flex items-center justify-center flex-shrink-0">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground truncate">
                                            {product.nombre_producto}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {product.categoria}
                                        </p>
                                        <Badge variant="secondary" className="mt-1 border-gray-300 bg-gray-100 text-sm font-semibold ">
                                            {product.unidad_medida}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

        </DialogContent>
    );
};
