// frontend/src/pages/SalesHistory.js
import React, { useState, useEffect } from 'react'; // Importa React y hooks para estado y efectos
import apiClient from '../services/api'; // Cliente API para comunicarse con el backend
import {
  Typography, // Texto estilizado
  Box, // Contenedor flexible
  CircularProgress, // Indicador de carga
  Accordion, // Componente para acordeones
  AccordionSummary, // Resumen del acordeón
  AccordionDetails, // Detalles del acordeón
  Grid, // Sistema de grilla
  Paper, // Contenedor tipo tarjeta
} from '@mui/material'; // Componentes de Material-UI
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Selector de fechas
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Ícono para expandir acordeones
import { subDays, format } from 'date-fns'; // Funciones para manejar fechas
import { toast } from 'react-toastify'; // Notificaciones para el usuario

// Componente SalesHistory: Muestra el historial de ventas con filtro por fechas
const SalesHistory = () => {
  // Estado para la lista de ventas
  const [sales, setSales] = useState([]);
  // Estado para indicar si los datos están cargando
  const [isLoading, setIsLoading] = useState(true);
  // Estado para la fecha de inicio (por defecto, últimos 30 días)
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  // Estado para la fecha de fin (por defecto, hoy)
  const [endDate, setEndDate] = useState(new Date());

  // Carga las ventas según el rango de fechas
  useEffect(() => {
    // Valida que la fecha de inicio no sea posterior a la de fin
    if (startDate > endDate) {
      toast.warn('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    setIsLoading(true);
    // Formatea las fechas para la API
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');

    // Intenta usar el endpoint de reportes, pero recurre al endpoint de ventas
    apiClient
      .get(
        `/api/reports/sales-summary?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      )
      .then(() => {
        // Como el endpoint de reportes agrupa por día, usa el endpoint original
        return apiClient.get('/api/sales'); // Obtiene todas las ventas
      })
      .then((response) => {
        setSales(response.data); // Guarda las ventas
      })
      .catch(() => toast.error('Error al cargar el historial de ventas.')) // Muestra error
      .finally(() => setIsLoading(false)); // Finaliza la carga
  }, [startDate, endDate]); // Se ejecuta al cambiar las fechas

  // Muestra un indicador de carga si los datos están cargando
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Filtra las ventas en el frontend según el rango de fechas
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.sale_date);
    return saleDate >= startDate && saleDate <= endDate;
  });

  return (
    <Box>
      {/* Título */}
      <Typography variant="h4" gutterBottom>
        Historial de Ventas
      </Typography>
      {/* Selectores de fecha */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DatePicker
          label="Fecha de Inicio"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          maxDate={endDate} // No permite fechas posteriores a la de fin
        />
        <DatePicker
          label="Fecha de Fin"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          minDate={startDate} // No permite fechas anteriores a la de inicio
        />
      </Paper>
      {/* Lista de ventas */}
      {filteredSales.length === 0 ? (
        <Typography>No hay ventas registradas en el rango de fechas seleccionado.</Typography>
      ) : (
        filteredSales.map((sale) => (
          <Accordion key={sale.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container spacing={2} alignItems="center">
                {/* ID de la venta */}
                <Grid item xs={12} sm={4}>
                  <Typography>
                    <strong>ID Venta:</strong> {sale.id}
                  </Typography>
                </Grid>
                {/* Fecha de la venta */}
                <Grid item xs={12} sm={4}>
                  <Typography>
                    <strong>Fecha:</strong>{' '}
                    {new Date(sale.sale_date).toLocaleString('es-AR')}
                  </Typography>
                </Grid>
                {/* Total de la venta */}
                <Grid item xs={12} sm={4}>
                  <Typography>
                    <strong>Total:</strong> ${parseFloat(sale.total_amount).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              {/* Detalles de los ítems de la venta */}
              <Typography variant="h6">Detalles:</Typography>
              {sale.items.map((item, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', py: 1 }}
                >
                  <Typography>{item.name}</Typography>
                  <Typography>
                    ({item.quantity} x ${parseFloat(item.priceAtSale).toFixed(2)})
                  </Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default SalesHistory;