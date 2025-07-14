import { Title } from "./Title"
import { LoginInputFields } from "./LoginInputFields"

export function LoginCard() {
    return (
        <>
            <div className="bg-white flex flex-col justify-center gap-8 shadow-[0px_2px_30px_#ccc6c6] p-10 h-[460px] w-[350px] relative rounded-lg" >
                <Title />
                <LoginInputFields />
                <div className="h-1 bg-blue-500 w-full absolute bottom-0 left-0"></div>
                <div className="text-sm font-semibold font-[Roboto] text-center ">
                    No tienes una cuenta? <a href="/register" className="cursor-pointer text-blue-500">Registrate aquí</a>
                </div>
            </div>
        </>
    )
}
