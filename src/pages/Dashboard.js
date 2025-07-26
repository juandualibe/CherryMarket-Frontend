// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react'; // Importa React y hooks para estado y efectos
import apiClient from '../services/api'; // Cliente API para comunicarse con el backend
import {
  Typography, // Texto estilizado
  Paper, // Contenedor tipo tarjeta
  Grid, // Sistema de grilla para el layout
  Box, // Contenedor flexible
  CircularProgress, // Indicador de carga
  List, // Lista para los productos más vendidos
  ListItem, // Ítem de la lista
  ListItemText, // Texto del ítem
} from '@mui/material'; // Componentes de Material-UI
import { toast } from 'react-toastify'; // Notificaciones para el usuario
import {
  BarChart, // Gráfico de barras
  Bar, // Barras del gráfico
  XAxis, // Eje X
  YAxis, // Eje Y
  CartesianGrid, // Cuadrícula del gráfico
  Tooltip, // Información emergente
  Legend, // Leyenda del gráfico
  ResponsiveContainer, // Contenedor responsive para el gráfico
} from 'recharts'; // Componentes de Recharts para gráficos
import { subDays, format, parseISO } from 'date-fns'; // Funciones para manejar fechas

// Componente Dashboard: Muestra estadísticas y gráficos de ventas
// Props:
// - userRole: Rol del usuario (admin o cashier)
// - refreshTrigger: Disparador para recargar datos
const Dashboard = ({ userRole, refreshTrigger }) => {
  // Estado para las estadísticas generales
  const [stats, setStats] = useState(null);
  // Estado para los datos de ventas por día
  const [salesData, setSalesData] = useState([]);
  // Estado para los productos más vendidos
  const [topProducts, setTopProducts] = useState([]);
  // Estado para indicar si los datos están cargando
  const [isLoading, setIsLoading] = useState(true);

  // Carga los datos del dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const endDate = new Date();
        const startDate = subDays(endDate, 6); // Últimos 7 días

        // Solicitudes al backend
        const statsPromise = apiClient.get('/api/dashboard/stats'); // Estadísticas generales
        const topProductsPromise = apiClient.get(
          '/api/reports/top-selling-products?limit=5'
        ); // Top 5 productos
        let promises = [statsPromise, topProductsPromise];

        // Solo para admins: datos de ventas semanales
        if (userRole === 'admin') {
          const salesPromise = apiClient.get(
            `/api/reports/sales-summary?startDate=${format(
              startDate,
              'yyyy-MM-dd'
            )}&endDate=${format(endDate, 'yyyy-MM-dd')}`
          );
          promises.push(salesPromise);
        }

        const responses = await Promise.all(promises); // Ejecuta las solicitudes en paralelo

        setStats(responses[0].data); // Guarda estadísticas
        setTopProducts(responses[1].data); // Guarda productos más vendidos
        if (responses[2]) {
          setSalesData(responses[2].data); // Guarda datos de ventas (solo admin)
        }
      } catch (error) {
        toast.error('Error al cargar los datos del dashboard.'); // Muestra error
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    fetchDashboardData();
  }, [userRole, refreshTrigger]); // Se ejecuta al cambiar el rol o el disparador

  // Muestra un indicador de carga si los datos están cargando
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Muestra un mensaje si no hay estadísticas
  if (!stats) {
    return <Typography>No se pudieron cargar las estadísticas.</Typography>;
  }

  // Formatea los valores del eje Y para el gráfico
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000) {
      return `$${(tickItem / 1000).toLocaleString('es-AR')}k`; // Formato en miles
    }
    return `$${tickItem}`; // Formato normal
  };

  return (
    <Box>
      {/* Título del dashboard */}
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Ventas del día */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Ventas del Día
            </Typography>
            <Typography component="p" variant="h4">
              ${stats.totalSalesToday.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        {/* Productos con bajo stock */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Productos con Bajo Stock
            </Typography>
            <Typography component="p" variant="h4">
              {stats.lowStockCount}
            </Typography>
          </Paper>
        </Grid>
        {/* Top 5 productos vendidos */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Top 5 Productos Vendidos
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
        {/* Gráfico de ventas semanales (solo admin) */}
        {userRole === 'admin' && (
          <Grid item xs={12}>
            <Paper
              sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 350 }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Ventas de la Última Semana
              </Typography>
              <ResponsiveContainer>
                <BarChart
                  data={salesData}
                  margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(dateStr) =>
                      format(parseISO(dateStr), 'dd/MM')
                    } // Formatea las fechas
                  />
                  <YAxis tickFormatter={formatYAxis} /> {/* Formatea el eje Y */}
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="total"
                    fill="#e53935"
                    name="Ventas ($)"
                    maxBarSize={50}
                  />
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