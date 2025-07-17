import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Importamos el ThemeProvider y nuestro tema
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// El resto de tus imports...
import { CssBaseline, Box, Button, Typography, AppBar, Toolbar } from '@mui/material';
import LoginPage from './LoginPage';
import Layout from './Layout';
import Dashboard from './Dashboard';
import ManagementView from './ManagementView';
import PosView from './PosView';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLoginSuccess = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    // 2. Envolvemos toda la aplicación en el ThemeProvider
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Normaliza los estilos base */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={
                        isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
                    } />

                    <Route path="/*" element={
                        isLoggedIn ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />
                    }>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="pos" element={<PosView />} />
                        <Route path="management" element={<ManagementView />} />
                        <Route index element={<Navigate to="/dashboard" />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;