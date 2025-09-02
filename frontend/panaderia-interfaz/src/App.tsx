import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LandingPage } from "./pages/LandingPage";
import MateriaPrimaPage from "./pages/MateriaPrimaPage";
import { AuthProvider, useAuth, withAuth } from "./context/AuthContext";
import ProductosIntermediosPage from "./pages/ProductosIntermediosPage";
import RecetasPage from "./pages/RecetasPage";
import ProductosFinalesPage from "./pages/ProductosFinalesPage";
import ProductionPage from "./pages/ProductionPage";

// Create protected versions of your components

const ProtectedLandingPage = withAuth(LandingPage);
const ProtectedMateriaPrimaPage = withAuth(MateriaPrimaPage);
const ProtectedProductosIntermediosPage = withAuth(ProductosIntermediosPage);
const ProtectedProductosFinalesPage = withAuth(ProductosFinalesPage);
const ProtectedProductionPage = withAuth(ProductionPage);
const ProtectedRecetasPage = withAuth(RecetasPage);

function Logout() {
  // This will be handled by the AuthProvider's logout method
  const { logout } = useAuth();
  logout();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/dashboard" element={<ProtectedLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<Logout />} />
            <Route
            path="/dashboard/materia-prima"
            element={<ProtectedMateriaPrimaPage />}
          />
          <Route
            path="/dashboard/productos-intermedios"
            element={<ProtectedProductosIntermediosPage />}
          />
          <Route 
            path="/dashboard/recetas" 
            element={<ProtectedRecetasPage />} 
          />
          <Route 
          path="/dashboard/productos-finales" 
          element={<ProtectedProductosFinalesPage />} 
          />
          <Route 
          path="/dashboard/produccion" 
          element={<ProtectedProductionPage />} 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
