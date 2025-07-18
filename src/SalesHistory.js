import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { Typography, Box, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/api/sales')
            .then(response => {
                setSales(response.data);
            })
            .catch(() => {
                toast.error('Error al cargar el historial de ventas.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Historial de Ventas
            </Typography>
            {sales.length === 0 ? (
                <Typography>No hay ventas registradas.</Typography>
            ) : (
                sales.map((sale) => (
                    <Accordion key={sale.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography><strong>ID Venta:</strong> {sale.id}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography><strong>Fecha:</strong> {new Date(sale.sale_date).toLocaleString('es-AR')}</Typography>
                                </Grid>
                                <Grid item xs={4}>
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