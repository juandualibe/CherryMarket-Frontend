import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Box, Typography, TextField, Button, Paper, Link, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from './assets/logo.png';

const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Nuevo estado
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                toast.success('¡Bienvenido!');
                onLoginSuccess();
                navigate('/dashboard');
            })
            .catch(error => {
                toast.error(error.response?.data?.message || 'Error al iniciar sesión.');
            });
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box component="img" sx={{ height: 120, width: 120, mb: 2 }} alt="Logo de Cherry Market." src={logo} />
                <Typography component="h1" variant="h4" gutterBottom>Cherry Market</Typography>
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
                        type={showPassword ? 'text' : 'password'} // Cambia el tipo dinámicamente
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{ // Aquí añadimos el ícono
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
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