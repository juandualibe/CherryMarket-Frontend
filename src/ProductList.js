import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import { toast } from 'react-toastify';

const ProductList = ({ refresh, onDataChanged }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Hubo un error al obtener los productos:', error);
                toast.error('Error al cargar los productos.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [refresh]);

    return (
        <div>
            <h2>Lista de Productos</h2>
            
            {/* ESTA ES LA LÓGICA EXPLICADA: */}
            {isLoading ? (
                // Si isLoading es true, muestra esto:
                <p>Cargando productos...</p>
            ) : (
                // Si isLoading es false, muestra esto:
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {products.map(product => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            onDataChanged={onDataChanged}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductList;