import React, { useState, useEffect } from 'react';
import apiClient from './api'; // Usamos apiClient que ya tiene la URL base
import { Typography, Box, Paper, Grid, Button, Chip, CircularProgress, TextField } from '@mui/material'; // Chip es nuevo
import { toast } from 'react-toastify';

// Recibe los productos y el estado de carga como props
const ProductCatalog = ({ products, isLoading, onAddToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    // --- NUEVOS ESTADOS PARA CATEGORÍAS ---
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' es la categoría por defecto

    // useEffect para obtener las categorías una sola vez
    useEffect(() => {
        apiClient.get('/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(() => toast.error('Error al cargar las categorías para el filtro.'));
    }, []);

    // useEffect para aplicar TODOS los filtros (búsqueda y categoría)
    useEffect(() => {
        let results = products;

        // 1. Filtrar por categoría seleccionada
        if (selectedCategory !== 'all') {
            results = results.filter(product => product.category_id === selectedCategory);
        }

        // 2. Filtrar por término de búsqueda sobre los resultados anteriores
        if (searchTerm) {
            results = results.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.barcode && product.barcode.includes(searchTerm))
            );
        }

        setFilteredProducts(results);
    }, [searchTerm, products, selectedCategory]); // Se re-ejecuta si cambia cualquiera de estos


    return (
        <Paper elevation={3} sx={{p: 2}}>
            <Typography variant="h5" component="h3" gutterBottom>
                Catálogo de Productos
            </Typography>
            <TextField
                fullWidth
                label="Buscar por nombre o código de barras..."
                variant="outlined"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/* Contenedor de los filtros de categoría */}
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                    label="Todos"
                    clickable
                    color={selectedCategory === 'all' ? 'primary' : 'default'}
                    onClick={() => setSelectedCategory('all')}
                />
                {categories.map(category => (
                    <Chip
                        key={category.id}
                        label={category.name}
                        clickable
                        color={selectedCategory === category.id ? 'primary' : 'default'}
                        onClick={() => setSelectedCategory(category.id)}
                    />
                ))}
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
            ) : (
                <Grid container spacing={2}>
                    {filteredProducts.map(product => (
                        <Grid item key={product.id} xs={6} sm={4} md={3}>
                            <Paper sx={{ p: 1, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2" component="strong">{product.name}</Typography>
                                <Typography variant="body2">${product.price}</Typography>
                                <Typography variant="caption">Stock: {product.stock}</Typography>
                                <Button 
                                    variant="contained" 
                                    size="small" 
                                    onClick={() => onAddToCart(product)} 
                                    disabled={product.stock === 0} 
                                    sx={{ mt: 1 }}
                                >
                                    {product.stock === 0 ? 'Sin Stock' : 'Añadir'}
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
};

export default ProductCatalog;