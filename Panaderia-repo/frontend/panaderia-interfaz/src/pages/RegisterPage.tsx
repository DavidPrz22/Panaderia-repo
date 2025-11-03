import { RegisterCard } from "../features/Authentication/components/register/RegisterCard";

export function RegisterPage() {
  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        backgroundImage: `url(/LoginBG.svg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <RegisterCard />
    </div>
  );
}
