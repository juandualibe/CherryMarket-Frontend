import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductList from './ProductList';
import AddProductForm from './AddProductForm';
import { Box } from '@mui/material';

const ManagementView = () => {
    // Estado para la lista de productos
    const [products, setProducts] = useState([]);
    // Estado para el indicador de carga
    const [isLoading, setIsLoading] = useState(false);
    // Estado para forzar la actualización de la lista
    const [refresh, setRefresh] = useState(false);

    // Función para forzar la actualización
    const handleDataChange = () => {
        setRefresh(!refresh);
    };

    // useEffect para obtener los productos cada vez que 'refresh' cambia
    useEffect(() => {
        setIsLoading(true);
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(() => toast.error('Error al cargar productos.'))
            .finally(() => setIsLoading(false));
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