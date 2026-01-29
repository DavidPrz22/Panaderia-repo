import { ArrowLeftRightIcon } from 'lucide-react';

export const TitleTransformacion = () => {
    return (
        <div className="flex items-center justify-start gap-4">
            <ArrowLeftRightIcon className="size-12 rounded-xl bg-blue-100 p-3 text-blue-500"/>
            
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Transformación de productos
                    </h1>
                    <p className=" text-gray-500 italic">
                        Aquí puedes gestionar y registrar las transformaciones de productos en tu panadería.
                    </p>
                </div>
        </div>
    );
};
