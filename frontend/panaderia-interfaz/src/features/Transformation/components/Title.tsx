import { TransformacionBlackIcon } from '@/assets/DashboardAssets';

export const TitleTransformacion = () => {
    return (
        <div className="flex items-center justify-start gap-2">
            <img
                src={TransformacionBlackIcon}
                className="p-2 w-10 h-10 flex items-center justify-center img-fluid rounded-top"
                alt="Transformacion Black Icon"
            />
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
