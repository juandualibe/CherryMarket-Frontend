import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { Typography, Paper, Grid, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Preparamos las fechas para el reporte de los últimos 7 días
                const endDate = new Date();
                const startDate = subDays(endDate, 6); // 6 días antes para un total de 7 días

                // Creamos las dos peticiones a la API
                const statsPromise = apiClient.get('/api/dashboard/stats');
                const salesPromise = apiClient.get(`/api/reports/sales-summary?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`);

                // Ejecutamos ambas peticiones en paralelo para mayor eficiencia
                const [statsResponse, salesResponse] = await Promise.all([statsPromise, salesPromise]);

                setStats(statsResponse.data);
                setSalesData(salesResponse.data);
            } catch (error) {
                toast.error('Error al cargar los datos del dashboard.');
                console.error("Error al cargar datos del dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

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
                            {stats.lowStockCount}
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1, mt: 2 }}>
                            Productos con menos de 10 unidades.
                        </Typography>
                    </Paper>
                </Grid>
                
                {/* Nuevo Gráfico de Ventas */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Ventas de la Última Semana
                        </Typography>
                        <ResponsiveContainer>
                            <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="total" stroke="#e53935" name="Ventas ($)" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;