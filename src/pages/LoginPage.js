// frontend/src/pages/LoginPage.js
import React, { useState } from 'react'; // Importa React y hook para estado
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Importa Link y hook de navegación
import axios from 'axios'; // Cliente HTTP para solicitudes al backend
import { toast } from 'react-toastify'; // Notificaciones para el usuario
import {
  Container, // Contenedor centrado
  Box, // Contenedor flexible
  Typography, // Texto estilizado
  TextField, // Campo de texto
  Button, // Botón interactivo
  Paper, // Contenedor tipo tarjeta
  Link, // Enlace estilizado
  IconButton, // Botón con ícono
  InputAdornment, // Adornos para el campo de texto
} from '@mui/material'; // Componentes de Material-UI
import Visibility from '@mui/icons-material/Visibility'; // Ícono para mostrar contraseña
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Ícono para ocultar contraseña
import logo from '../assets/logo.png'; // Importa el logo de la aplicación

// Componente LoginPage: Formulario para iniciar sesión
// Props:
// - onLoginSuccess: Función para manejar el éxito del inicio de sesión
const LoginPage = ({ onLoginSuccess }) => {
  // Estado para el nombre de usuario
  const [username, setUsername] = useState('');
  // Estado para la contraseña
  const [password, setPassword] = useState('');
  // Estado para mostrar u ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Hook para navegar programáticamente
  const navigate = useNavigate();

  // Maneja el inicio de sesión
  const handleLogin = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        username,
        password,
      }) // Envía credenciales al backend
      .then((response) => {
        localStorage.setItem('token', response.data.token); // Guarda el token
        toast.success('¡Bienvenido!'); // Notifica éxito
        onLoginSuccess(); // Llama a la función de éxito
        navigate('/dashboard'); // Navega al dashboard
      })
      .catch((error) =>
        toast.error(error.response?.data?.message || 'Error al iniciar sesión.')
      ); // Muestra error
  };

  // Alterna la visibilidad de la contraseña
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  // Evita comportamiento no deseado al hacer clic en el ícono
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Container component="main" maxWidth="sm"> {/* Contenedor centrado */}
      <Paper
        elevation={6}
        sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Logo de la aplicación */}
        <Box
          component="img"
          sx={{ height: 120, width: 120, mb: 2 }}
          alt="Logo de Cherry Market."
          src={logo}
        />
        {/* Título */}
        <Typography component="h1" variant="h4" gutterBottom>
          Cherry Market
        </Typography>
        {/* Subtítulo */}
        <Typography component="p" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Inicia sesión para gestionar el sistema de productos y ventas.
        </Typography>
        {/* Formulario de inicio de sesión */}
        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
          {/* Campo para el usuario */}
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
          {/* Campo para la contraseña */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'} // Cambia dinámicamente
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
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
          {/* Botón para enviar el formulario */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Iniciar Sesión
          </Button>
          {/* Enlace para registrarse */}
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