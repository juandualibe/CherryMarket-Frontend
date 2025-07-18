import React, { useState, useEffect } from 'react'; // LÍNEA CORREGIDA
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

// Pequeño componente para proteger las rutas
const ProtectedRoute = ({ isLoggedIn, children }) => {
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <CssBaseline />
                <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar />
                <BrowserRouter>
                    <Routes>
                        {/* Rutas Públicas */}
                        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Rutas Protegidas */}
                        <Route
                            path="/dashboard"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout}><Dashboard /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/pos"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout}><PosView /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/management"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout}><ManagementView /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/history"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout}><SalesHistory /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/categories"
                            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout onLogout={handleLogout}><CategoryManager /></Layout></ProtectedRoute>}
                        />

                        {/* Redirección por defecto */}
                        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
                    </Routes>
                </BrowserRouter>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;