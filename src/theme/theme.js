import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Creamos nuestro tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      // Usamos un tono de rojo de la paleta predefinida de Material-UI
      main: red[700],
    },
    secondary: {
      // Un color secundario, por ejemplo, para botones menos importantes
      main: '#cecece',
    },
    background: {
        // Color de fondo general de la app
        default: '#f4f6f8',
        // Color de fondo para las "superficies" como las tarjetas
        paper: '#ffffff',
    }
  },
});

export default theme;