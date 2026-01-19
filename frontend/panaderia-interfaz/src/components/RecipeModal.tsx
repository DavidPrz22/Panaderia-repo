import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { PendingTubeSpinner } from "./PendingTubeSpinner";
import type { recetaDetallesItem } from "@/features/Recetas/types/types";

interface RecipeModalProps {
    data?: recetaDetallesItem;
    isLoading: boolean;
    isOpen: boolean;
    onClose: () => void;
}


export function RecipeModal({ data, isLoading, isOpen, onClose }: RecipeModalProps) {

    const recipeIngredients = data?.componentes || [];
    const materiasPrimas = recipeIngredients.filter((i) => i.tipo === "Materia Prima");
    const productosIntermedios = recipeIngredients.filter((i) => i.tipo === "Producto Intermedio");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                {isLoading ? (
                    <div className="h-40 flex items-center justify-center">
                        <PendingTubeSpinner size={40} />
                    </div>
                ) : !data ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No se encontraron detalles de la receta.
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                Receta: {data.receta.nombre}
                            </DialogTitle>
                            <DialogDescription>
                                Ingredientes necesarios para elaborar este producto
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 mt-4">
                            {/* Info General */}
                            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                                <div>
                                    <span className="font-semibold block text-muted-foreground">Rendimiento:</span>
                                    {data.receta.rendimiento ? `${data.receta.rendimiento} Unidades` : "No especificado"}
                                </div>
                                <div>
                                    <span className="font-semibold block text-muted-foreground">Notas:</span>
                                    {data.receta.notas || "Sin notas adicionales"}
                                </div>
                            </div>

                            {/* Productos Intermedios */}
                            {productosIntermedios.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1">
                                        Productos Intermedios
                                    </h3>
                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead>Ingrediente</TableHead>
                                                    <TableHead>Tipo</TableHead>
                                                    <TableHead className="text-right">Cantidad</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {productosIntermedios.map((ingredient) => (
                                                    <TableRow key={ingredient.id}>
                                                        <TableCell className="font-medium">{ingredient.nombre}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary">Intermedio</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {ingredient.cantidad} {ingredient.unidad_medida}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}

                            {/* Materias Primas */}
                            {materiasPrimas.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1">
                                        Materias Primas
                                    </h3>
                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead>Ingrediente</TableHead>
                                                    <TableHead>Tipo</TableHead>
                                                    <TableHead className="text-right">Cantidad</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {materiasPrimas.map((ingredient) => (
                                                    <TableRow key={ingredient.id}>
                                                        <TableCell className="font-medium">{ingredient.nombre}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">Materia Prima</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {ingredient.cantidad} {ingredient.unidad_medida}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}

                            {recipeIngredients.length === 0 && (
                                <p className="text-center text-muted-foreground py-8 italic">
                                    No hay ingredientes listados para esta receta.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
