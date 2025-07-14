import { RegisterHeader } from "./ResgisterHeader";
import { RegisterInputFields } from "./RegisterInputFields";
import { Link } from "react-router-dom";

export function RegisterCard() {   
    
    return (
        <div className="bg-white flex flex-col justify-center gap-4 shadow-[0px_2px_30px_#ccc6c6] p-10 h-[640px] w-[400px] relative rounded-lg" >
            <RegisterHeader />
            <RegisterInputFields />
            <div className="text-sm font-semibold font-[Roboto] text-center">
                Ya tienes una cuenta? <Link to="/login" className="cursor-pointer text-blue-500">Inicia sesión aquí</Link>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
        </div>
    )
}