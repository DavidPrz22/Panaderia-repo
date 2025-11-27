import { DashBoardCard } from "./DashBoardCard"


export const DashBoardCards = () => {

    return (
        <div className="flex flex-col lg:flex-row gap-5"> 
            <DashBoardCard 
                type="Ventas"
                value="$12,450"
                smallText="23 transacciones"
                boldedText="+12% vs ayer"
            />

            <DashBoardCard 
                type="Pedidos Pendientes"
                value="9"
                smallText="4 para hoy"
                boldedText="+11% vs ayer"
            />

            <DashBoardCard 
                type="Alertas"
                value="12"
                smallText="3 criticas"
                boldedText="requieren atencion"
            />

            <DashBoardCard 
                type="Producción"
                value="43"
                smallText="ultimas 24 horas"
                boldedText="+6% vs ayer"
            />
        </div>
    )
}