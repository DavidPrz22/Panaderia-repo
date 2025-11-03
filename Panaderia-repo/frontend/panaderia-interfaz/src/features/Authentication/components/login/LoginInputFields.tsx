import { LoginButton } from "./LoginButton";
import { useForm } from "react-hook-form";
import type { TLoginUserSchema } from "@/features/Authentication/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "@/features/Authentication/schemas/schemas";
import { LoginInputField } from "./LoginInputField";
import { useLoginMutation } from "../../hooks/mutations/AuthMutations";
import { UserIcon, PasswordIcon } from "@/assets/LoginRegisterAssets";

export function LoginInputFields() {
  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
  } = useForm<TLoginUserSchema>({ resolver: zodResolver(loginUserSchema) });

  const { mutate: login, isPending } = useLoginMutation(setError);

  const onSubmit = async (data: TLoginUserSchema) => {
    const isValid = Object.keys(errors).length === 0;
    if (isValid) {
      login(data);
    }
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        {/* Nombre de usuario */}
        <LoginInputField
          title="Nombre de usuario"
          name="username"
          placeholder="Escribe tu nombre de usuario"
          type="text"
          register={register}
          errors={errors}
          icon={UserIcon}
        />

        {/* Contraseña */}
        <LoginInputField
          title="Contraseña"
          name="password"
          placeholder="Escribe tu contraseña"
          type="password"
          register={register}
          errors={errors}
          icon={PasswordIcon}
        />

        <LoginButton type="submit" isPending={isPending} />
      </div>
    </form>
  );
}
