export default function HeaderButton({icon}: {icon: string}) {
    return (
        <div className="flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded-full p-2 transition-colors duration-200 w-10 h-10">
            <img src={icon} alt={icon} />
        </div>
    )
}