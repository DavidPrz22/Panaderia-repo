import type { MateriaPrimaList } from "@/lib/types";

export const TableRows = ({data, onclick}: {data: MateriaPrimaList[], onclick: (pk: number) => void}) => {
        return (
            <> 
            {data.map((item, index) => (
                <div onClick={() => onclick(item.id)}
                key={item.id} className={`cursor-pointer hover:bg-gray-200 grid grid-cols-7 justify-between px-8 py-4 border-b border-gray-300 ${index % 2 !== 0 ? "bg-white" : "bg-gray-100"} font-[Roboto] text-md`}>
                    <div>{item.id}</div>
                    <div>{item.name}</div>
                    <div>{item.unit}</div>
                    <div>{item.category}</div>
                    <div>{item.quantity}</div>
                    <div>{item.reorderPoint}</div>
                    <div>{item.creationDate}</div>
                </div>
            ))}
        </>
    );
};