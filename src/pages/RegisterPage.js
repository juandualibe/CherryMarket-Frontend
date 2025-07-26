// frontend/src/pages/RegisterPage.js
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

// Componente RegisterPage: Formulario para registrar un nuevo usuario
const RegisterPage = () => {
  // Estado para el nombre de usuario
  const [username, setUsername] = useState('');
  // Estado para la contraseña
  const [password, setPassword] = useState('');
  // Estado para mostrar u ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Hook para navegar programáticamente
  const navigate = useNavigate();

  // Maneja el registro del usuario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        password,
      }) // Envía los datos al backend
      .then(() => {
        toast.success('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.'); // Notifica éxito
        navigate('/login'); // Navega a la página de login
      })
      .catch((error) =>
        toast.error(error.response?.data?.message || 'Error al registrar el usuario.')
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
        {/* Título */}
        <Typography component="h1" variant="h4" gutterBottom>
          Crear una Cuenta
        </Typography>
        {/* Formulario de registro */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          {/* Campo para el usuario */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nombre de Usuario"
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
            autoComplete="new-password"
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
            Registrarse
          </Button>
          {/* Enlace para iniciar sesión */}
          <Typography align="center">
            <Link component={RouterLink} to="/login" variant="body2">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;