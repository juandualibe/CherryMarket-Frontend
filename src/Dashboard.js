import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { Typography, Paper, Grid, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Hacemos la llamada a nuestro nuevo endpoint del dashboard
        apiClient.get('/api/dashboard/stats')
            .then(response => {
                setStats(response.data);
            })
            .catch(() => {
                toast.error('Error al cargar las estadísticas.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); // Se ejecuta una sola vez al cargar el componente

    // Muestra un indicador de carga mientras se obtienen los datos
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Muestra un mensaje si no se pudieron cargar las estadísticas
    if (!stats) {
        return <Typography>No se pudieron cargar las estadísticas.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240, justifyContent: 'center', textAlign: 'center' }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Ventas del Día
                        </Typography>
                        <Typography component="p" variant="h4">
                            {/* Mostramos el dato real de la API */}
                            ${stats.totalSalesToday.toFixed(2)}
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1, mt: 2 }}>
                            Total registrado hoy ({new Date().toLocaleDateString('es-AR')})
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240, justifyContent: 'center', textAlign: 'center' }}>
                         <Typography variant="h6" color="primary" gutterBottom>
                            Productos con Bajo Stock
                        </Typography>
                        <Typography component="p" variant="h4">
                            {/* Mostramos el dato real de la API */}
                            {stats.lowStockCount}
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1, mt: 2 }}>
                            Productos con menos de 10 unidades.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;