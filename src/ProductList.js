import React from 'react';
import ProductItem from './ProductItem';
import { Typography, Box, CircularProgress } from '@mui/material';

// Este componente solo recibe props y las muestra. No hace llamadas a la API.
const ProductList = ({ products, isLoading, onDataChanged }) => {
    return (
        <Box>
            <Typography variant="h5" component="h3" gutterBottom>
                Lista de Productos
            </Typography>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    {products.map(product => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            onDataChanged={onDataChanged}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ProductList;