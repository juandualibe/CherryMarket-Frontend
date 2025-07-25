import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { Typography, Box, Paper, Grid, Button, Chip, CircularProgress, TextField } from '@mui/material';
import { toast } from 'react-toastify';

const ProductCatalog = ({ products, isLoading, onAddToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        apiClient.get('/api/categories')
            .then(response => setCategories(response.data))
            .catch(() => toast.error('Error al cargar las categorías.'));
    }, []);

    useEffect(() => {
        let results = products;

        if (selectedCategory !== 'all') {
            results = results.filter(product => product.category_id === selectedCategory);
        }

        if (searchTerm) {
            results = results.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.barcode && product.barcode.includes(searchTerm))
            );
        }

        setFilteredProducts(results);
    }, [searchTerm, products, selectedCategory]);

    // --- NUEVA FUNCIÓN PARA MANEJAR EL ESCANEO ---
    const handleBarcodeScan = (event) => {
        // Verificamos si la tecla presionada es 'Enter'
        if (event.key === 'Enter' && searchTerm.trim() !== '') {
            event.preventDefault(); // Evita cualquier comportamiento por defecto del Enter

            // Buscamos un producto cuyo código de barras coincida EXACTAMENTE
            const foundProduct = products.find(p => p.barcode === searchTerm.trim());

            if (foundProduct) {
                onAddToCart(foundProduct); // Si lo encontramos, lo añadimos al carrito
                setSearchTerm(''); // Limpiamos la barra de búsqueda para el siguiente escaneo
            } else {
                toast.warn('Producto no encontrado por código de barras.');
            }
        }
    };

    return (
        <Paper elevation={3} sx={{p: 2}}>
            <Typography variant="h5" component="h3" gutterBottom>
                Catálogo de Productos
            </Typography>
            <TextField
                fullWidth
                label="Buscar por nombre o escanear código de barras..."
                variant="outlined"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleBarcodeScan} // --- AÑADIMOS EL DETECTOR DE TECLAS AQUÍ ---
                sx={{ mb: 2 }}
            />

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