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

// Función para obtener el estado inicial del token
const getInitialAuthState = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            return { isLoggedIn: true, userRole: decoded.role };
        } catch (e) {
            return { isLoggedIn: false, userRole: null };
        }
    }
    return { isLoggedIn: false, userRole: null };
};

// Componente para proteger rutas generales
const ProtectedRoute = ({ isLoggedIn, children }) => {
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Componente para proteger rutas de administradores
const AdminRoute = ({ isLoggedIn, userRole, children }) => {
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    if (userRole !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

function App() {
    const [authState, setAuthState] = useState(getInitialAuthState());

    const handleLoginSuccess = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setAuthState({ isLoggedIn: true, userRole: decodedToken.role });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthState({ isLoggedIn: false, userRole: null });
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

                        <Route
                            path="/dashboard"
                            element={<ProtectedRoute isLoggedIn={authState.isLoggedIn}><Layout onLogout={handleLogout} userRole={authState.userRole}><Dashboard userRole={authState.userRole} /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/pos"
                            element={<ProtectedRoute isLoggedIn={authState.isLoggedIn}><Layout onLogout={handleLogout} userRole={authState.userRole}><PosView /></Layout></ProtectedRoute>}
                        />
                        <Route
                            path="/management"
                            element={<AdminRoute isLoggedIn={authState.isLoggedIn} userRole={authState.userRole}><Layout onLogout={handleLogout} userRole={authState.userRole}><ManagementView /></Layout></AdminRoute>}
                        />
                        <Route
                            path="/history"
                            element={<AdminRoute isLoggedIn={authState.isLoggedIn} userRole={authState.userRole}><Layout onLogout={handleLogout} userRole={authState.userRole}><SalesHistory /></Layout></AdminRoute>}
                        />
                        <Route
                            path="/categories"
                            element={<AdminRoute isLoggedIn={authState.isLoggedIn} userRole={authState.userRole}><Layout onLogout={handleLogout} userRole={authState.userRole}><CategoryManager /></Layout></AdminRoute>}
                        />
                        
                        <Route path="*" element={<Navigate to={authState.isLoggedIn ? "/dashboard" : "/login"} />} />
                    </Routes>
                </BrowserRouter>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;