import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode'; // 1. Importamos el decodificador

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

// El componente ProtectedRoute no necesita cambios
const ProtectedRoute = ({ isLoggedIn, children }) => {
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); // 2. Nuevo estado para el rol

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role); // Guardamos el rol
                setIsLoggedIn(true);
            } catch (error) {
                // Si el token es inválido, lo borramos
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLoginSuccess = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.role); // Guardamos el rol al iniciar sesión
            setIsLoggedIn(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null); // Limpiamos el rol
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

                        {/* 3. Pasamos el rol del usuario al Layout */}
                        <Route
                            path="/dashboard"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout} userRole={userRole}><Dashboard /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/pos"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout} userRole={userRole}><PosView /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/management"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout} userRole={userRole}><ManagementView /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/history"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout} userRole={userRole}><SalesHistory /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/categories"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout} userRole={userRole}><CategoryManager /></Layout></ProtectedRoute>}
                        />
                        
                        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
                    </Routes>
                </BrowserRouter>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;