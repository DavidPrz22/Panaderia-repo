import { LoginCard } from "../components/LoginComponents/LoginCard"

export function LoginPage() {
    return (
        <>
            <div className="flex  justify-center items-center h-screen bg-[url(/LoginBG.svg)] bg-cover bg-center">
                <LoginCard />
            </div>
        </>
    )
}