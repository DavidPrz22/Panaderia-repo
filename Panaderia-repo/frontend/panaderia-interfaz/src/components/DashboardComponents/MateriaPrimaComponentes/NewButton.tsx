export default function NewButton({onClick}: {onClick: () => void}) {

    return (
        <button className="flex items-center gap-2 bg-blue-500 font-semibold font-[Roboto] text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer" onClick={onClick}>
            <img src="/DashboardAssets/Plussign.svg" alt="Nuevo" />
            Nuevo
        </button>
    )
}