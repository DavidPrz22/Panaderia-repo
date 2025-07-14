import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
import { API } from "@/lib/types";

// ... existing code ...
export const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        authToken();
    }, []);

    const refreshToken = async () => {
        const refresh = window.localStorage.getItem(REFRESH_TOKEN);
        if (!refresh) {
            setIsAuthorized(false);
            return;
        }

        try {
            const response = await fetch(`${API}/api/token/refresh/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({refresh}),
            })
            if (!response.ok) {
                setIsAuthorized(false);
                return;
            }
            const data = await response.json();

            if (data.access) {
                window.localStorage.setItem(ACCESS_TOKEN, data.access);
                window.localStorage.setItem(REFRESH_TOKEN, data.refresh);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }

        } catch (error) {
            console.error(error);
            setIsAuthorized(false);
        }
    }
    
    const authToken = async () => {
        const access = window.localStorage.getItem(ACCESS_TOKEN);

        if (!access) {
            setIsAuthorized(false);
            return;
        }
    
        try {
            const decoded = jwtDecode(access);
            if (decoded.exp && decoded.exp < Date.now() / 1000) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error(error);
            setIsAuthorized(false);
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />
}