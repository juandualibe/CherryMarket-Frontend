import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import { CssBaseline, Box, Button, Typography, AppBar, Toolbar } from '@mui/material';
import LoginPage from './LoginPage';
import Layout from './Layout';
import Dashboard from './Dashboard';
import ManagementView from './ManagementView';
import PosView from './PosView';
import RegisterPage from './RegisterPage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLoginSuccess = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* --- CAMBIO AQUÍ --- */}
            <ToastContainer
                position="bottom-center" // Posición en la parte inferior
                autoClose={2000}        // Duración de 2 segundos
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={
                        isLoggedIn ? <Navigate to="/dashboard" /> : <RegisterPage />
                    } />
                    
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