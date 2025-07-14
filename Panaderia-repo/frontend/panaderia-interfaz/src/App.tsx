import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LandingPage } from "./pages/LandingPage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./lib/constants";
import MateriaPrimaPage from "./pages/MateriaPrimaPage";
import ClientesPage from "./pages/ClientesPage";
import ClientesRegistroPage from "./pages/ClientesRegistroPage";
import AppContext from "./context/AppContext";
// import { ProtectedRoute } from "./components/ProtectedRoute";

function logout() {
  window.localStorage.removeItem(ACCESS_TOKEN);
  window.localStorage.removeItem(REFRESH_TOKEN);
  return <Navigate to="/login" />;
}

function App() {
  return (
    <AppContext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route
            path="/dashboard"
            element={
              <LandingPage />
              // <ProtectedRoute>
              //   <LandingPage />
              // </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={logout()} />
          <Route
            path="/dashboard/materia-prima"
            element={<MateriaPrimaPage />}
          />
          <Route path="/dashboard/clientes" element={<ClientesPage />} />
          <Route path="/clientes/registro" element={<ClientesRegistroPage />} />
        </Routes>
      </BrowserRouter>
    </AppContext>
  );
}

export default App;
