export default function HeaderUserButton() {
    return (
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 rounded-full p-2 transition-colors duration-200">
            <div className="text-md font-semibold">Usuario</div>
            <div className="flex items-center cursor-pointer">
                <img src="/DashboardAssets/Usuario.svg" alt="Usuario" />
            </div>
        </div>
    )
}