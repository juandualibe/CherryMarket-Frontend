// frontend/src/App.js
import React, { useState, useEffect } from 'react'; // Importa React y hooks para estado y efectos
import {
  BrowserRouter, // Proveedor para la navegación basada en el navegador
  Routes, // Contenedor para definir rutas
  Route, // Define una ruta específica
  Navigate, // Componente para redirecciones
} from 'react-router-dom'; // Importa herramientas de react-router-dom para el enrutamiento
import { ToastContainer } from 'react-toastify'; // Contenedor para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Estilos para las notificaciones de react-toastify
import { jwtDecode } from 'jwt-decode'; // Función para decodificar tokens JWT

import { ThemeProvider } from '@mui/material/styles'; // Proveedor para el tema de Material-UI
import theme from './theme/theme'; // Tema personalizado de Material-UI
import { CssBaseline } from '@mui/material'; // Normaliza estilos CSS

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Proveedor para localización de fechas
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Adaptador para date-fns
import { es } from 'date-fns/locale'; // Localización en español para date-fns

// Importa páginas y componentes
import LoginPage from './pages/LoginPage'; // Página de inicio de sesión
import RegisterPage from './pages/RegisterPage'; // Página de registro
import Layout from './components/common/Layout'; // Componente de layout con menú lateral y barra superior
import Dashboard from './pages/Dashboard'; // Página del dashboard
import ManagementView from './pages/ManagementView'; // Página de gestión de productos
import PosView from './pages/PosView'; // Página del punto de venta
import SalesHistory from './pages/SalesHistory'; // Página del historial de ventas
import CategoryManager from './pages/CategoryManager'; // Página de gestión de categorías

// Función para obtener el estado inicial de autenticación
const getInitialAuthState = () => {
  const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local
  if (token) {
    try {
      const decoded = jwtDecode(token); // Decodifica el token JWT
      return { isLoggedIn: true, userRole: decoded.role }; // Devuelve estado autenticado y rol
    } catch (e) {
      return { isLoggedIn: false, userRole: null }; // Devuelve estado no autenticado si falla
    }
  }
  return { isLoggedIn: false, userRole: null }; // Devuelve estado no autenticado si no hay token
};

// Componente ProtectedRoute: Protege rutas para usuarios autenticados
// Props:
// - isLoggedIn: Booleano que indica si el usuario está autenticado
// - children: Componente hijo a renderizar si está autenticado
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; // Redirige a /login si no está autenticado
  }
  return children; // Renderiza el componente hijo si está autenticado
};

// Componente AdminRoute: Protege rutas solo para usuarios con rol 'admin'
// Props:
// - isLoggedIn: Booleano que indica si el usuario está autenticado
// - userRole: Rol del usuario
// - children: Componente hijo a renderizar si es admin
const AdminRoute = ({ isLoggedIn, userRole, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; // Redirige a /login si no está autenticado
  }
  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />; // Redirige a /dashboard si no es admin
  }
  return children; // Renderiza el componente hijo si es admin
};

// Componente App: Componente principal que define la estructura y enrutamiento de la aplicación
function App() {
  // Estado para manejar la autenticación y el rol del usuario
  const [authState, setAuthState] = useState(getInitialAuthState());
  // Estado para disparar la recarga de datos en el dashboard
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Maneja el éxito del inicio de sesión
  const handleLoginSuccess = () => {
    const token = localStorage.getItem('token'); // Obtiene el token
    if (token) {
      const decodedToken = jwtDecode(token); // Decodifica el token
      setAuthState({ isLoggedIn: true, userRole: decodedToken.role }); // Actualiza el estado
    }
  };

  // Maneja el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    setAuthState({ isLoggedIn: false, userRole: null }); // Resetea el estado
  };

  // Dispara una recarga de datos en el dashboard
  const triggerDataRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Incrementa el contador
  };

  return (
    <ThemeProvider theme={theme}> {/* Aplica el tema personalizado */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}> {/* Configura la localización de fechas */}
        <CssBaseline /> {/* Normaliza estilos CSS */}
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar
        /> {/* Configura las notificaciones */}
        <BrowserRouter> {/* Habilita el enrutamiento */}
          <Routes>
            {/* Ruta para la página de login */}
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />
            {/* Ruta para la página de registro */}
            <Route path="/register" element={<RegisterPage />} />
            {/* Ruta protegida para el dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isLoggedIn={authState.isLoggedIn}>
                  <Layout onLogout={handleLogout} userRole={authState.userRole}>
                    <Dashboard
                      userRole={authState.userRole}
                      refreshTrigger={refreshTrigger}
                    />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* Ruta protegida para el punto de venta */}
            <Route
              path="/pos"
              element={
                <ProtectedRoute isLoggedIn={authState.isLoggedIn}>
                  <Layout onLogout={handleLogout} userRole={authState.userRole}>
                    <PosView onSaleSuccess={triggerDataRefresh} />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* Ruta protegida solo para admins: gestión de productos */}
            <Route
              path="/management"
              element={
                <AdminRoute
                  isLoggedIn={authState.isLoggedIn}
                  userRole={authState.userRole}
                >
                  <Layout onLogout={handleLogout} userRole={authState.userRole}>
                    <ManagementView />
                  </Layout>
                </AdminRoute>
              }
            />
            {/* Ruta protegida solo para admins: historial de ventas */}
            <Route
              path="/history"
              element={
                <AdminRoute
                  isLoggedIn={authState.isLoggedIn}
                  userRole={authState.userRole}
                >
                  <Layout onLogout={handleLogout} userRole={authState.userRole}>
                    <SalesHistory />
                  </Layout>
                </AdminRoute>
              }
            />
            {/* Ruta protegida solo para admins: gestión de categorías */}
            <Route
              path="/categories"
              element={
                <AdminRoute
                  isLoggedIn={authState.isLoggedIn}
                  userRole={authState.userRole}
                >
                  <Layout onLogout={handleLogout} userRole={authState.userRole}>
                    <CategoryManager />
                  </Layout>
                </AdminRoute>
              }
            />
            {/* Ruta por defecto: redirige según el estado de autenticación */}
            <Route
              path="*"
              element={
                <Navigate to={authState.isLoggedIn ? '/dashboard' : '/login'} />
              }
            />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;