import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { toast } from 'react-toastify';
import { Box, TextField, Button, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AddProductForm = ({ onDataChanged }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [barcode, setBarcode] = useState('');
    const [categoryId, setCategoryId] = useState(''); // Estado para la categoría seleccionada
    const [categories, setCategories] = useState([]); // Estado para guardar la lista de categorías

    // Obtenemos las categorías cuando el componente se carga
    useEffect(() => {
        apiClient.get('/api/categories')
            .then(response => setCategories(response.data))
            .catch(() => toast.error('No se pudieron cargar las categorías.'));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = { name, price, stock, barcode, category_id: categoryId };
        apiClient.post('/api/products', newProduct)
            .then(() => {
                toast.success('¡Producto añadido con éxito!');
                // Limpiamos todos los campos
                setName(''); setPrice(''); setStock(''); setBarcode(''); setCategoryId('');
                onDataChanged();
            })
            .catch(() => toast.error('Error al añadir producto.'));
    };

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
                
                {/* Selector de Categorías */}
                <FormControl fullWidth>
                    <InputLabel id="category-select-label">Categoría</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={categoryId}
                        label="Categoría"
                        onChange={e => setCategoryId(e.target.value)}
                    >
                        <MenuItem value=""><em>Sin Categoría</em></MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="primary">Añadir Producto</Button>
            </Box>
        </Paper>
    );
};

export default AddProductForm;