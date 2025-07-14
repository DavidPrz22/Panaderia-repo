export function LoginButton({type}: {type: "submit"}) {
    return (
        <>
            <button type={type} className="bg-blue-500 w-full text-white font-semibold p-2 rounded-xs cursor-pointer" >Iniciar sesión</button>
        </>
    )
}