import { LoginCard } from "@/features/Authentication/components/login/LoginCard";

export function LoginPage() {
  return (
    <>
      <div
        className="flex justify-center items-center h-screen"
        style={{
          backgroundImage: `url(/LoginBG.svg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <LoginCard />
      </div>
    </>
  );
}
