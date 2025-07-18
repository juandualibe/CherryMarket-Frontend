import axios from 'axios';

// Creamos una instancia de Axios con configuración base
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Usamos un interceptor para añadir el token a cada petición
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;