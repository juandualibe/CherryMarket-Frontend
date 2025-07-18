import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Box, Typography, TextField, Button, Paper, Link } from '@mui/material';
import logo from './assets/logo.png';

const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const credentials = { username, password };

        // --- LÓGICA DE LOGIN REAL ---
        axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, credentials)
            .then(response => {
                // 1. Guardamos el token que nos da el backend
                localStorage.setItem('token', response.data.token);
                toast.success('¡Bienvenido!');
                onLoginSuccess(); // Avisamos a App.js que el login fue exitoso
            })
            .catch(error => {
                const message = error.response?.data?.message || 'Error al iniciar sesión.';
                toast.error(message);
            });
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box component="img" sx={{ height: 120, width: 120, mb: 2 }} alt="Logo de Cherry Market." src={logo} />
                <Typography component="h1" variant="h4" gutterBottom>
                    Cherry Market
                </Typography>
                <Typography component="p" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Inicia sesión para gestionar el sistema de productos y ventas.
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Usuario"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Iniciar Sesión
                    </Button>
                    <Typography align="center">
                        <Link component={RouterLink} to="/register" variant="body2">
                            ¿No tienes una cuenta? Regístrate
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;