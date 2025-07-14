export default function ColapseSidebarButton() {
    return (
        <div className="relative flex justify-center items-center cursor-pointer p-3 bg-white/20 rounded-md">
            <img className="absolute left-3 size-5" src="/DashboardAssets/Left.svg" alt="Left" />
            <img className="absolute left-3 size-5 hidden" src="/DashboardAssets/Right.svg" alt="Right" />
            <div className="text-white text-md">Colapsar Menú</div>
        </div>
    )
}