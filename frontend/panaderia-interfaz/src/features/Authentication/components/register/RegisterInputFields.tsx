import { useForm } from "react-hook-form";
import type { TRegisterUserSchema } from "@/features/Authentication/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "@/features/Authentication/schemas/schemas";
import { RegisterButton } from "./RegisterButton";
import RegisterInputContainer from "./RegisterInputContainer";
import RegisterSelectContainer from "./RegisterSelectContainer";
import { useRegisterMutation } from "../../hooks/mutations/AuthMutations";
import {
  UserIcon,
  PasswordIcon,
  EmailIcon,
} from "@/assets/LoginRegisterAssets";

export function RegisterInputFields() {
  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
  } = useForm<TRegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
  });

  const { mutate: registerUser, isPending } = useRegisterMutation(setError);

  const onSubmit = async (data: TRegisterUserSchema) => {
    registerUser(data);
  };

  return (
    <>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2.5">
          {/* Nombre de usuario */}
          <RegisterInputContainer
            title="Nombre de usuario"
            name="username"
            placeholder="Escribe tu nombre de usuario"
            type="text"
            register={register}
            errors={errors}
            icon={UserIcon}
          />

          {/* Nombre Completo */}
          <RegisterInputContainer
            title="Nombre completo"
            name="full_name"
            placeholder="Escribe tu nombre de usuario"
            type="text"
            register={register}
            errors={errors}
            icon={UserIcon}
          />

          {/* Contraseña */}
          <RegisterInputContainer
            title="Contraseña"
            name="password"
            placeholder="Escribe tu contraseña"
            type="password"
            register={register}
            errors={errors}
            icon={PasswordIcon}
          />

          {/* Repetir contraseña */}
          <RegisterInputContainer
            title="Repetir contraseña"
            name="repeatpassword"
            placeholder="Repite tu contraseña"
            type="password"
            register={register}
            errors={errors}
            icon={PasswordIcon}
          />

          {/* Repetir Email */}
          <RegisterInputContainer
            title="Correo electrónico (opcional)"
            name="email"
            placeholder="Escribe tu email"
            type="email"
            register={register}
            errors={errors}
            icon={EmailIcon}
          />

          {/* Repetir Selecionar Rol */}
          <RegisterSelectContainer
            title="Rol"
            name="rol"
            register={register}
            errors={errors}
          />

          <RegisterButton type="submit" isPending={isPending} />
        </div>
      </form>
    </>
  );
}
