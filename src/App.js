import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { CssBaseline } from '@mui/material';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Layout from './Layout';
import Dashboard from './Dashboard';
import ManagementView from './ManagementView';
import PosView from './PosView';

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

                    {/* Redirección por defecto */}
                    <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;