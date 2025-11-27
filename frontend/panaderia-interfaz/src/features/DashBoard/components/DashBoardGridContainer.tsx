import { GridItemProducts } from "./GridItemProducts"
import { GridItemCompras } from "./GridItemCompras"
import { GridItemVentas } from "./GridItemVentas"
import { GridItemTrends } from "./GridItemTrends"

export const DashBoardGridContainer = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 ">
            <GridItemProducts />
            <GridItemTrends />
            <GridItemCompras />
            <GridItemVentas />
        </div>
    )
}