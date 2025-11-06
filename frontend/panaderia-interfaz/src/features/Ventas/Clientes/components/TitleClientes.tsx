import { ClientesIconBlack } from "@/assets/DashboardAssets";



export default function TitleClientes() {   
    return (
        <>
        <h1 className="text-2xl font-bold text-gray-900">
            <img src={ClientesIconBlack} alt="Icono" className="inline-block mr-2" />
            Gestión de Clientes
        </h1>
        <p className="text-gray-500 italic">
            Aquí puedes gestionar y visualizar la información de tus clientes.
        </p>
        
        </>
    );
}