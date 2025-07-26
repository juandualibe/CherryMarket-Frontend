// frontend/src/PosView.js
import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { toast } from 'react-toastify';
import ProductCatalog from './ProductCatalog';
import ShoppingCart from './ShoppingCart';
import Calculator from './Calculator'; // Importar la calculadora
import { Grid, Paper } from '@mui/material';

const PosView = ({ onSaleSuccess }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [refreshProducts, setRefreshProducts] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get('/api/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        toast.error('Error al cargar los productos.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refreshProducts]);

  const addToCart = (productToAdd) => {
    if (!productToAdd.id && !productToAdd.isManual) {
      toast.error('Producto inválido.');
      return;
    }
    const itemInCart = cart.find((item) => item.id === productToAdd.id);
    const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;
    if (!productToAdd.isManual && currentQuantityInCart >= productToAdd.stock) {
      toast.warn(`No hay más stock disponible para ${productToAdd.name}.`);
      return;
    }
    if (itemInCart) {
      setCart(
        cart.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...productToAdd, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId, amount, newItem = null) => {
    if (newItem) {
      setCart([...cart, { ...newItem, id: productId, quantity: amount }]);
      return;
    }

    const productInCatalog = products.find((p) => p.id === productId);
    const itemInCart = cart.find((item) => item.id === productId);
    if (!itemInCart || !productInCatalog) return;

    const newQuantity = itemInCart.quantity + amount;
    if (amount > 0 && !itemInCart.isManual && newQuantity > productInCatalog.stock) {
      toast.warn(`No se puede añadir más de ${productInCatalog.name}. Stock máximo: ${productInCatalog.stock}.`);
      return;
    }

    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío.');
      return;
    }
    const saleData = {
      cart: cart.map(({ id, quantity, price, isManual, name }) => ({
        id: isManual ? null : id,
        name: isManual ? name : (products.find((p) => p.id === id)?.name || 'Producto desconocido'),
        quantity,
        price: parseFloat(price),
        isManual: !!isManual,
      })),
      total: cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0),
    };
    apiClient
      .post('/api/sales', saleData)
      .then((response) => {
        toast.success('¡Venta registrada con éxito!');
        setCart([]);
        apiClient.get('/api/products').then((res) => setProducts(res.data));
        setRefreshProducts((prev) => !prev);
        onSaleSuccess();
      })
      .catch((error) => {
        console.error('Error al finalizar la venta:', error);
        toast.error(error.response?.data?.message || 'Error al registrar la venta.');
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <ProductCatalog
          products={products}
          isLoading={isLoading}
          onAddToCart={addToCart}
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <ShoppingCart
                cart={cart}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                onFinalizeSale={handleFinalizeSale}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Calculator />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PosView;