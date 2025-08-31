export const ProductionRadioInput = ({name, id, label} :{name: string, id: string, label: string}) => {
    return (
        <label className="flex items-center gap-2 cursor-pointer" htmlFor={id} >
            <input 
                type="radio" 
                name={name}
                id={id}
                className="size-4"
            />
            {label}
        </label>
    )
}