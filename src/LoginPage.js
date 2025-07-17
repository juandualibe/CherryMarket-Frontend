import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';

// 1. Importamos la imagen del logo desde la carpeta assets
import logo from './assets/logo.png';

const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            toast.success('¡Bienvenido!');
            onLoginSuccess();
        } else {
            toast.error('Usuario o contraseña incorrectos.');
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* 2. Añadimos la imagen aquí */}
                <Box
                    component="img"
                    sx={{
                        height: 120,
                        width: 120,
                        mb: 2, // Margen inferior de 2 unidades
                    }}
                    alt="Logo de Cherry Market."
                    src={logo}
                />

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
                        id="username"
                        label="Usuario"
                        name="username"
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
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Iniciar Sesión
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;