import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { CssBaseline } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Layout from './Layout';
import Dashboard from './Dashboard';
import ManagementView from './ManagementView';
import PosView from './PosView';
import SalesHistory from './SalesHistory';
import CategoryManager from './CategoryManager';

// Componente para proteger rutas generales
const ProtectedRoute = ({ isLoggedIn, children }) => {
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }
    return children;
};

// Nuevo componente para proteger rutas SOLO de administradores
const AdminRoute = ({ isLoggedIn, userRole, children }) => {
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }
    if (userRole !== 'admin') {
        // Si no es admin, lo mandamos al dashboard
        return <Navigate to="/dashboard" />;
    }
    return children;
};


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
                setIsLoggedIn(true);
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLoginSuccess = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.role);
            setIsLoggedIn(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <CssBaseline />
                <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar />
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Rutas para TODOS los usuarios logueados */}
                        <Route
                            path="/dashboard"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout} userRole={userRole}><Dashboard /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/pos"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout} userRole={userRole}><PosView /></Layout></ProtectedRoute>}
                        />

                        {/* Rutas SOLO PARA ADMINS */}
                        <Route
                            path="/management"
                            element={<AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}><Layout onLogout={handleLogout} userRole={userRole}><ManagementView /></Layout></AdminRoute>}
                        />
                        <Route
                            path="/history"
                            element={<AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}><Layout onLogout={handleLogout} userRole={userRole}><SalesHistory /></Layout></AdminRoute>}
                        />
                        <Route
                            path="/categories"
                            element={<AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}><Layout onLogout={handleLogout} userRole={userRole}><CategoryManager /></Layout></AdminRoute>}
                        />
                        
                        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
                    </Routes>
                </BrowserRouter>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;