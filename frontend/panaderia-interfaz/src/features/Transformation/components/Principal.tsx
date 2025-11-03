import { NuevaTransformacionBtn } from "./NuevaTransformacionBtn";
import { RegistrosBtn } from "./RegistroBtn";
import { TitleTransformacion } from "./Title";

export default function Principal() {
    return (
        <div className="flex-1 p-6">
        <header className="ml-0 md:ml-10 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
                <TitleTransformacion /> 
                <div className="mt-4 flex gap-3">
                    <NuevaTransformacionBtn />
                    <RegistrosBtn />
                </div>
            </div>
        </header>
        </div>
    );
}   
