import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { Typography, Paper, Grid, Box, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { subDays, format, parseISO } from 'date-fns';

const Dashboard = ({ userRole }) => {
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]); // Nuevo estado para los productos top
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Preparamos las peticiones a la API
                const statsPromise = apiClient.get('/api/dashboard/stats');
                const topProductsPromise = apiClient.get('/api/reports/top-selling-products?limit=5');
                
                let promises = [statsPromise, topProductsPromise];

                // La petición del gráfico de ventas es SOLO para admins
                if (userRole === 'admin') {
                    const endDate = new Date();
                    const startDate = subDays(endDate, 6);
                    const salesPromise = apiClient.get(`/api/reports/sales-summary?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`);
                    promises.push(salesPromise);
                }

                const responses = await Promise.all(promises);

                setStats(responses[0].data);
                setTopProducts(responses[1].data);
                if (responses[2]) {
                    setSalesData(responses[2].data);
                }

            } catch (error) {
                toast.error('Error al cargar los datos del dashboard.');
                console.error("Error al cargar datos del dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [userRole]);

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
            <Typography variant="h4" gutterBottom>Dashboard</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240, justifyContent: 'center', textAlign: 'center' }}>
                        <Typography variant="h6" color="primary" gutterBottom>Ventas del Día</Typography>
                        <Typography component="p" variant="h4">${stats.totalSalesToday.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240, justifyContent: 'center', textAlign: 'center' }}>
                         <Typography variant="h6" color="primary" gutterBottom>Productos con Bajo Stock</Typography>
                        <Typography component="p" variant="h4">{stats.lowStockCount}</Typography>
                    </Paper>
                </Grid>

                {/* --- NUEVA TARJETA: PRODUCTOS MÁS VENDIDOS --- */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Productos Más Vendidos
                        </Typography>
                        <List>
                            {topProducts.map((product, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemText 
                                        primary={`${index + 1}. ${product.name}`} 
                                        secondary={`Vendidos: ${product.total_sold}`} 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                
                {userRole === 'admin' && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 350 }}>
                            <Typography variant="h6" color="primary" gutterBottom>Ventas de la Última Semana</Typography>
                            <ResponsiveContainer>
                                <BarChart data={salesData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tickFormatter={(dateStr) => format(parseISO(dateStr), 'dd/MM')} />
                                    <YAxis tickFormatter={(tick) => `$${tick.toLocaleString()}`} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total" fill="#e53935" name="Ventas ($)" maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default Dashboard;