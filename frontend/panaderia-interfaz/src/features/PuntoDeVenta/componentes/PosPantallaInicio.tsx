import { Button } from "@/components/ui/button"

export const PosApertura = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <h1>Pos Apertura</h1>
            <Button>Aperturar</Button>
        </div>
    )
}

export const PosCierre = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <h1>Pos Cierre</h1>
            <Button>Cerrar</Button>
        </div>
    )
}

export const PosCerrado = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <h1>Pos Cerrado</h1>
            <p>Consulta con tu gerente</p>
        </div>
    )
}