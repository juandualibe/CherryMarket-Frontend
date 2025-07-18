import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';


const AddProductForm = ({ onDataChanged }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [barcode, setBarcode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = { name, price, stock, barcode };

        axios.post(`${process.env.REACT_APP_API_URL}/api/products`, newProduct)
            .then(response => {
                toast.success('¡Producto añadido con éxito!');
                // Limpiamos los campos del formulario
                setName('');
                setPrice('');
                setStock('');
                setBarcode('');
                onDataChanged();
            })
            .catch(error => {
                toast.error('Error al añadir producto.');
                console.error('Hubo un error al añadir el producto:', error);
            });
    };

    // Este return asume que ya refactorizaste a MUI.
    // Si no lo hiciste, usa tu JSX anterior.
    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom>
                Añadir Nuevo Producto
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Nombre del producto" variant="outlined" value={name} onChange={e => setName(e.target.value)} required />
                <TextField label="Precio" type="number" variant="outlined" value={price} onChange={e => setPrice(e.target.value)} required />
                <TextField label="Stock" type="number" variant="outlined" value={stock} onChange={e => setStock(e.target.value)} />
                <TextField label="Código de barras" variant="outlined" value={barcode} onChange={e => setBarcode(e.target.value)} />
                <Button type="submit" variant="contained" color="primary">Añadir Producto</Button>
            </Box>
        </Paper>
    );
};

export default AddProductForm;