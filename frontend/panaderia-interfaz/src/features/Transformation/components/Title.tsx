import { TransformacionBlackIcon } from '@/assets/DashboardAssets';

export const TitleTransformacion = () => {
    return (
        <div className="static ml-60 mt-4 flex items-center justify-center gap-2 mb-4 md:mb-0">
            <img
                src={TransformacionBlackIcon}
                className="p-2 size-15 flex items-center justify-center img-fluid rounded-top"
                alt="Transformacion Black Icon"
            />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Transformación de productos
                    </h1>
                    <p className=" text-sm text-gray-600">
                        Aquí puedes gestionar y registrar las transformaciones de productos en tu panadería.
                    </p>
                </div>
        </div>
    );
};
