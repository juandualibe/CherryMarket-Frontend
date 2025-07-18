import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductCatalog from './ProductCatalog';
import ShoppingCart from './ShoppingCart';
import { Grid, Paper } from '@mui/material'; // Importamos Grid


const PosView = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}/api/products`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                toast.error('Error al cargar los productos.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const addToCart = (productToAdd) => {
        const itemInCart = cart.find(item => item.id === productToAdd.id);
        const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;
        if (currentQuantityInCart >= productToAdd.stock) {
            toast.warn('No hay más stock disponible para este producto.');
            return;
        }
        if (itemInCart) {
            setCart(cart.map(item =>
                item.id === productToAdd.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...productToAdd, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (productId, amount) => {
        const productInCatalog = products.find(p => p.id === productId);
        const itemInCart = cart.find(item => item.id === productId);
        if (amount > 0 && itemInCart.quantity + amount > productInCatalog.stock) {
            toast.warn('No se puede añadir más, stock máximo alcanzado.');
            return;
        }
        setCart(currentCart =>
            currentCart.map(item => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + amount;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(Boolean)
        );
    };

    const handleRemoveItem = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const handleFinalizeSale = () => {
        if (cart.length === 0) {
            toast.error('El carrito está vacío.');
            return;
        }
        const saleData = {
            cart: cart.map(({ id, quantity, price }) => ({ id, quantity, price })),
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
        axios.post(`${process.env.REACT_APP_API_URL}/api/sales`, saleData)
            .then(response => {
                toast.success('¡Venta registrada con éxito!');
                setCart([]);
            })
            .catch(error => {
                console.error('Error al finalizar la venta:', error);
                toast.error(error.response?.data?.message || 'Error al registrar la venta.');
            });
    };

    // Este return asume que ya refactorizaste a MUI.
    return (
        // Usamos el componente Grid container
        <Grid container spacing={3}>
            {/* El catálogo ocupará 12/12 columnas en móvil y 7/12 en escritorio */}
            <Grid item xs={12} md={7}>
                <ProductCatalog 
                    products={products}
                    isLoading={isLoading}
                    onAddToCart={addToCart} 
                />
            </Grid>
            {/* El carrito ocupará 12/12 columnas en móvil y 5/12 en escritorio */}
            <Grid item xs={12} md={5}>
                <Paper sx={{p: 2, height: '100%'}}>
                    <ShoppingCart
                        cart={cart}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                        onFinalizeSale={handleFinalizeSale}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
};

export default PosView;