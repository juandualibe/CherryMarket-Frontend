// frontend/src/services/api.js
import axios from 'axios'; // Importa Axios para realizar solicitudes HTTP

// Crea una instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // URL base para todas las solicitudes, definida en las variables de entorno
});

// Configura un interceptor para añadir el token de autenticación a cada solicitud
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtiene el token de autenticación del almacenamiento local
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Añade el token al encabezado Authorization
    }
    return config; // Devuelve la configuración modificada
  },
  (error) => {
    return Promise.reject(error); // Rechaza la promesa si ocurre un error
  }
);

export default apiClient; // Exporta la instancia de Axios configurada