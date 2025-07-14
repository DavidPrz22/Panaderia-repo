import { LoginInput } from "./LoginInput"   
import { LoginButton } from "./LoginButton"
import { useForm } from "react-hook-form"
import type { TLoginUserSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginUserSchema } from "@/lib/schemas"
import { handleLogin } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants"

export function LoginInputFields() {
    const navigate = useNavigate();
    const {     
        handleSubmit, 
        formState: {errors},
        register,
        setError
    } = useForm<TLoginUserSchema>({resolver: zodResolver(loginUserSchema)});

    const onSubmit = async (data: TLoginUserSchema) => {
        const response = await handleLogin(data);
        if (response.failed && response.errorData) {
            setError("password", {message: response.errorData.detail});
        } else {
            window.localStorage.setItem(ACCESS_TOKEN, response.access);
            window.localStorage.setItem(REFRESH_TOKEN, response.refresh);
            navigate("/dashboard")
        }
    }

    return (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="flex flex-col gap-6">
                {/* Nombre de usuario */}
                        <div className="flex flex-col gap-1.5">
                            <div className="text-sm font-semibold font-[Roboto]">Nombre de usuario</div>
                            <div className="relative">
                                <img src="/usericon.png" alt="usericon" className="absolute left-2.5 bottom-3.5 size-[16px]"/>
                                <LoginInput placeholder="Escribe tu nombre de usuario" type="text" register={register} name='username'/>
                            </div>
                            <p className="text-red-500 text-xs">{errors.username?.message}</p>
                        </div>

                {/* Contraseña */}
                        <div className="flex flex-col gap-1.5">
                            <div className="text-sm font-semibold font-[Roboto]">Contraseña</div>
                            <div className="relative">
                                <img src="/passwordicon.png" alt="passwordicon" className="absolute left-2.5 bottom-3.5 size-[16px]"/>
                                <LoginInput placeholder="Escribe tu contraseña" type="password" register={register} name='password'/>
                            </div>
                            <p className="text-red-500 text-xs">{errors.password?.message}</p>
                        </div>
                <LoginButton type="submit" />
            </div>
        </form>
    )
}