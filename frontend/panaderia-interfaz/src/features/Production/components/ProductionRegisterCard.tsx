import { SearchIconDark } from "@/assets/DashboardAssets";

export const ProductionRegisterCard = () => {
  return (
    <div className="flex flex-col gap-5 p-8 bg-white rounded-lg shadow-md border border-gray-200" >
            <div className="flex flex-col">
                <span className="text-lg font-semibold">
                    Informacion de Producción
                </span>
                <span className="text-gray-500 italic">
                    Selecciona el tipo y producto a producir
                </span>
            </div>
            <div>
                <div className="text-lg font-semibold">
                    Tipo de Producto
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer" htmlFor="tipo-producto-1" >
                        <input 
                            type="radio" 
                            name="tipo-producto"
                            id="tipo-producto-1"
                            className="size-4"
                            />
                        Producto Elaborado
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer " htmlFor="tipo-producto-2">
                        <input 
                            type="radio" 
                            name="tipo-producto"
                            id="tipo-producto-2"
                            className="size-4"
                            />
                        Producto Intermedio
                    </label>
                </div>
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="font-semibold font-[Roboto]">Producto a Producir</div>
                        <div className="flex gap-2 relative">
                            <div className="absolute top-3 left-3">
                                <img src={SearchIconDark} className="size-5" alt="Buscar" />
                            </div>
                            <div className="w-full">
                                <input type="text" className="pl-11 py-2 w-full outline-none border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300"
                                placeholder="Busca un producto..."/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="font-semibold font-[Roboto]">Cantidad a Producir</div>
                        <div className="flex gap-2">
                            <div className="w-full">
                                <input type="number" className="pl-2 py-2 w-full outline-none border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300"
                                placeholder="Busca un producto..."/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="font-semibold font-[Roboto]">Fecha de Vencimiento</div>
                        <div className="flex gap-2 relative">
                            <div className="absolute top-3 left-3">
                                <img src={SearchIconDark} className="size-5" alt="Buscar" />
                            </div>
                            <div className="w-full">
                                <input type="text" className="pl-11 py-2 w-full outline-none border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300"
                                placeholder="Busca un producto..."/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      {/* Aquí va el contenido del registro de producción */}
    </div>
  );
};
