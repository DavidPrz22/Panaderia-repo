import { HEADER_BAR_HEIGHT, SIDEBAR_WIDTH } from "@/lib/constants";
import Sidebar from "../components/DashboardComponents/Sidebar/Sidebar";
import HeaderBar from "@/components/DashboardComponents/HeaderBar/HeaderBar";
import MateriaPrimaLista from "@/components/DashboardComponents/MateriaPrimaComponentes/MateriaPrimaLista";
import MateriasPrimasForma from "@/components/DashboardComponents/MateriaPrimaComponentes/MateriasPrimasForma";
import { MaterialPrimaDetalles } from "@/components/DashboardComponents/MateriaPrimaComponentes/MaterialPrimaDetalles";

export default function MateriaPrimaPage() {

    const headerStyles = {
        marginLeft: `${SIDEBAR_WIDTH}px`,
        marginTop: `${HEADER_BAR_HEIGHT}px`,
    };

    return (
        <>
            <Sidebar />
            <HeaderBar />
            <div className="flex min-h-screen bg">
                <div className={`flex-1 ml-[${SIDEBAR_WIDTH}px] pt-[${HEADER_BAR_HEIGHT}px]`} style={headerStyles}>
                    <main className='bg-gray-300 py-3 h-full'>

                        <MateriaPrimaLista />
                        <MateriasPrimasForma />
                        <MaterialPrimaDetalles />
                    </main>
                </div>
            </div>















            {/* <div className="grid grid-cols-7 justify-between px-8 py-4 bg-white font-bold font-[Roboto] text-lg mx-4 my-4 rounded-lg">
                            <div>Id</div>
                            <div>Nombre</div>
                            <div>Unidad de medida</div>
                            <div>Categoria</div>
                            <div>Cantidad</div>
                            <div>Punto de reorden</div>
                            <div>Precio</div>
                        </div>
                        <div className="grid grid-cols-7 justify-between px-8 py-4 bg-white font-[Roboto] text-lg mx-4 my-2 rounded-lg">
                            <div>1</div>
                            <div>Harina de Trigo</div>
                            <div>Kg</div>
                            <div>Bakery</div>
                            <div>100</div>
                            <div>150</div>
                            <div>45</div>
                        </div>*/}
        </>
    )
}