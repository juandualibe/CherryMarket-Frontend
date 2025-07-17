import React from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';

const Dashboard = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                        <Typography variant="h6" color=".text-dark" gutterBottom>
                            Ventas del Día
                        </Typography>
                        <Typography component="p" variant="h4">
                            $1,250.00
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                            al 17 de Julio, 2025
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                         <Typography variant="h6" color=".text-dark" gutterBottom>
                            Productos con Bajo Stock
                        </Typography>
                        <Typography component="p" variant="h4">
                            5
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                            Productos con menos de 10 unidades.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;