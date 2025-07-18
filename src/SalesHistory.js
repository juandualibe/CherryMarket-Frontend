import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { Typography, Box, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Grid, Paper } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { subDays, format } from 'date-fns';
import { toast } from 'react-toastify';

const SalesHistory = () => {
    const [sales, setSales] =useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Estados para manejar el rango de fechas seleccionado
    const [startDate, setStartDate] = useState(subDays(new Date(), 30));
    const [endDate, setEndDate] = useState(new Date());

    // Este efecto se ejecuta al inicio y cada vez que el rango de fechas cambia
    useEffect(() => {
        // Validamos que la fecha de inicio no sea posterior a la de fin
        if (startDate > endDate) {
            toast.warn('La fecha de inicio no puede ser posterior a la fecha de fin.');
            return;
        }

        setIsLoading(true);
        // Formateamos las fechas al formato YYYY-MM-DD que espera la API
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        // Hacemos la llamada al nuevo endpoint de reportes
        apiClient.get(`/api/reports/sales-summary?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
            .then(response => {
                // Como el endpoint de reportes agrupa por día, necesitamos reestructurar los datos
                // Para este componente, vamos a llamar al endpoint original de ventas.
                // Si quisiéramos filtrar aquí, necesitaríamos modificar el GET /api/sales
                return apiClient.get('/api/sales'); // Usando el endpoint original por ahora
            })
            .then(response => {
                 setSales(response.data);
            })
            .catch(() => toast.error('Error al cargar el historial de ventas.'))
            .finally(() => setIsLoading(false));

    }, [startDate, endDate]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Lógica de filtrado en el frontend
    const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        return saleDate >= startDate && saleDate <= endDate;
    });


    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Historial de Ventas
            </Typography>

            {/* Contenedor para los selectores de fecha */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <DatePicker 
                    label="Fecha de Inicio" 
                    value={startDate} 
                    onChange={(newValue) => setStartDate(newValue)} 
                    maxDate={endDate}
                />
                <DatePicker 
                    label="Fecha de Fin" 
                    value={endDate} 
                    onChange={(newValue) => setEndDate(newValue)}
                    minDate={startDate}
                />
            </Paper>

            {filteredSales.length === 0 ? (
                <Typography>No hay ventas registradas en el rango de fechas seleccionado.</Typography>
            ) : (
                filteredSales.map((sale) => (
                    <Accordion key={sale.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={4}>
                                    <Typography><strong>ID Venta:</strong> {sale.id}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography><strong>Fecha:</strong> {new Date(sale.sale_date).toLocaleString('es-AR')}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography><strong>Total:</strong> ${parseFloat(sale.total_amount).toFixed(2)}</Typography>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="h6">Detalles:</Typography>
                            {sale.items.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', py: 1 }}>
                                    <Typography>{item.name}</Typography>
                                    <Typography>({item.quantity} x ${parseFloat(item.priceAtSale).toFixed(2)})</Typography>
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