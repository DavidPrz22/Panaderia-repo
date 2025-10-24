import { NuevaTransformacionBtn } from "./NuevaTransformacionBtn";
import { RegistrosBtn } from "./RegistroBtn";
import { TitleTransformacion } from "./Title";

export default function Principal() {
    return (
    <div className="flex-1 px-0 py-4">
    <header className="mt-0 w-full">
            <div className="w-full max-w-full px-12">
                <div className="flex items-center justify-between mb-5 w-full">
                    <div className="flex-1 pl-0">
                        <TitleTransformacion />
                    </div>
                    <div className="flex gap-3 items-center pr-0">
                        <NuevaTransformacionBtn />
                        <RegistrosBtn />
                    </div>
                </div>
            </div>
        </header>
        </div>
    );
}   
