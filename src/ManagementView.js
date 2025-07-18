import React, { useState, useEffect } from 'react';
import apiClient from './api'; // 1. Cambiamos la importación
import { toast } from 'react-toastify';
import ProductList from './ProductList';
import AddProductForm from './AddProductForm';
import { Box } from '@mui/material';

const ManagementView = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const handleDataChange = () => {
        setRefresh(!refresh);
    };

    useEffect(() => {
        setIsLoading(true);
        // 2. Usamos apiClient en lugar de axios
        apiClient.get('/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(() => {
                toast.error('Error al cargar productos.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [refresh]);

    return (
        <Box>
            <AddProductForm onDataChanged={handleDataChange} />
            <ProductList
                products={products}
                isLoading={isLoading}
                onDataChanged={handleDataChange}
            />
        </Box>
    );
};

export default ManagementView;