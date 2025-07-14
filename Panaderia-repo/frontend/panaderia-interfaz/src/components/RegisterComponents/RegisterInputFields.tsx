import { useForm } from "react-hook-form";
import { RegisterInput } from "./RegisterInput";
import type { TRegisterUserSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "@/lib/schemas";
import { RegisterButton } from "./RegisterButton";
import { handleRegister } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { translateApiError } from "@/lib/translations";

export function RegisterInputFields() {
    const navigate = useNavigate();
    const {
        handleSubmit, 
        formState: {errors},
        register,
        setError
    } = useForm<TRegisterUserSchema>({resolver: zodResolver(registerUserSchema)});

    const onSubmit = async (data: TRegisterUserSchema) => {
        const response = await handleRegister(data);
        if (response.failed && response.errorData) {
            console.error(response.errorData);
            
            for (const fieldName in response.errorData) {
                if (Object.prototype.hasOwnProperty.call(response.errorData, fieldName)) {
                    const errorMessages = response.errorData[fieldName];
                    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                        const message = translateApiError(errorMessages[0]);
                        setError(fieldName as keyof TRegisterUserSchema, { message });
                    }
                }
            }
        } else {
            navigate("/login");
        }
    }

    return (
        <>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3.5">
                    {/* Nombre de usuario */}
                    <div className="flex flex-col gap-1.5">
                            <div className="text-xs font-semibold font-[Roboto]">Nombre de usuario</div>
                                <div className="relative">
                                    <img src="/usericon.png" alt="usericon" className="absolute left-2.5 bottom-2.5 size-[16px]"/>
                                    <RegisterInput placeholder="Escribe tu nombre de usuario" type="text" name='username' register={register}/>
                            </div>
                            <p className="text-red-500 text-xs">{errors.username?.message}</p>
                    </div>

                    {/* Nombre Completo */}
                    <div className="flex flex-col gap-1.5">
                            <div className="text-xs font-semibold font-[Roboto]">Nombre completo</div>
                                <div className="relative">
                                    <img src="/usericon.png" alt="usericon" className="absolute left-2.5 bottom-2.5 size-[16px]"/>
                                    <RegisterInput placeholder="Escribe tu nombre de usuario" type="text" name='full_name' register={register}/>
                            </div>
                            <p className="text-red-500 text-xs">{errors.full_name?.message}</p>
                    </div>

                    {/* Contraseña */}
                    <div className="flex flex-col gap-1.5">
                            <div className="text-xs font-semibold font-[Roboto]">Contraseña</div>
                                <div className="relative">
                                    <img src="/passwordicon.png" alt="usericon" className="absolute left-2.5 bottom-2.5 size-[16px]"/>
                                    <RegisterInput placeholder="Escribe tu contraseña" type="password" name='password' register={register}/>
                            </div>
                            <p className="text-red-500 text-xs">{errors.password?.message}</p>
                    </div>

                    {/* Repetir contraseña */}
                    <div className="flex flex-col gap-1.5">
                            <div className="text-xs font-semibold font-[Roboto]">Repetir contraseña</div>
                                <div className="relative">
                                    <img src="/passwordicon.png" alt="usericon" className="absolute left-2.5 bottom-2.5 size-[16px]"/>
                                    <RegisterInput placeholder="Repite tu contraseña" type="password" name='repeatpassword' register={register}/>
                            </div>
                            <p className="text-red-500 text-xs">{errors.repeatpassword?.message}</p>
                    </div>

                    {/* Repetir Email */}
                    <div className="flex flex-col gap-1.5">
                            <div className="text-xs font-semibold font-[Roboto]">Correo electrónico (opcional)</div>
                                <div className="relative">
                                    <img src="/emailicon.png" alt="usericon" className="absolute left-2.5 bottom-2.5 size-[16px]"/>
                                    <RegisterInput placeholder="Escribe tu email" type="email" name='email' register={register}/>
                            </div>
                            <p className="text-red-500 text-xs">{errors.email?.message}</p>
                    </div>

                    {/* Repetir Selecionar Rol */}
                    <div className="flex flex-col gap-1.5">
                            <div className="text-xs font-semibold font-[Roboto]">Rol</div>
                            <select {...register('rol')} className="w-full cursor-pointer text-xs p-2 border font-semibold font-[Roboto] border-gray-300 bg-gray-100 rounded-xs outline-0
                            focus:outline-blue-500 focus:outline-2">
                                <option value=""></option>
                                <option value="Gerente">Gerente</option>
                                <option value="Vendedor">Vendedor</option>
                            </select>
                    </div>

                    <RegisterButton type="submit" />
                </div>
            </form> 
        </>

    )
}