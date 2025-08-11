export default function NoResults({children}: {children: React.ReactNode}) {
    return (
        <div className="flex flex-col justify-center px-4 border border-gray-300 w-full h-[50px] shadow-lg
                        font-[Roboto] text-md font-semibold
                        overflow-y-auto absolute top-[100%] left-0 bg-white z-10"
        >
            {children}
        </div>
    );
}