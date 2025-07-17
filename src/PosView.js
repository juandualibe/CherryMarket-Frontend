// frontend/src/PosView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductCatalog from './ProductCatalog';
import ShoppingCart from './ShoppingCart';

const PosView = () => {
    // 1. ESTADOS CENTRALIZADOS AQUÍ
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);

    // 2. LA LÓGICA PARA OBTENER PRODUCTOS AHORA VIVE AQUÍ
    useEffect(() => {
        setIsLoading(true);
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                toast.error('Error al cargar los productos.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); // Se ejecuta solo una vez al cargar la vista

    const addToCart = (productToAdd) => {
        const itemInCart = cart.find(item => item.id === productToAdd.id);
        const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;

        // 3. VALIDACIÓN DE STOCK MEJORADA
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

        // 4. VALIDACIÓN AL CAMBIAR CANTIDAD
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
        
        axios.post('http://localhost:5000/api/sales', saleData)
            .then(response => {
                toast.success('¡Venta registrada con éxito!');
                setCart([]); // Vaciamos el carrito
                // Aquí podríamos también refrescar el catálogo de productos para ver el stock actualizado
            })
            .catch(error => {
                console.error('Error al finalizar la venta:', error);
                toast.error(error.response?.data?.message || 'Error al registrar la venta.');
            });
    };

    return (
        <div>
            <h2>Punto de Venta</h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ flex: 2 }}>
                    {/* 5. PASAMOS LOS DATOS AL CATÁLOGO COMO PROPS */}
                    <ProductCatalog 
                        products={products}
                        isLoading={isLoading}
                        onAddToCart={addToCart} 
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <ShoppingCart
                        cart={cart}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                        onFinalizeSale={handleFinalizeSale}
                    />
                </div>
            </div>
        </div>
    );
};

export default PosView;