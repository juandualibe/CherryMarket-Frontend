// frontend/src/pages/PosView.js
import React, { useState, useEffect } from 'react'; // Importa React y hooks para estado y efectos
import apiClient from '../services/api'; // Cliente API para comunicarse con el backend
import { toast } from 'react-toastify'; // Notificaciones para el usuario
import ProductCatalog from '../components/sales/ProductCatalog'; // Componente para mostrar productos
import ShoppingCart from '../components/sales/ShoppingCart'; // Componente para el carrito
import Calculator from '../components/ui/Calculator'; // Componente para la calculadora
import { Grid, Paper } from '@mui/material'; // Componentes de Material-UI para el layout

// Componente PosView: Interfaz para el punto de venta
// Props:
// - onSaleSuccess: Función para manejar el éxito de una venta
const PosView = ({ onSaleSuccess }) => {
  // Estado para la lista de productos del catálogo
  const [products, setProducts] = useState([]);
  // Estado para indicar si los datos están cargando
  const [isLoading, setIsLoading] = useState(false);
  // Estado para los ítems en el carrito
  const [cart, setCart] = useState([]);
  // Estado para disparar la recarga de productos
  const [refreshProducts, setRefreshProducts] = useState(false);

  // Carga los productos al montar el componente o al cambiar refreshProducts
  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get('/api/products') // Solicita la lista de productos
      .then((response) => {
        setProducts(response.data); // Guarda los productos
      })
      .catch((error) => {
        toast.error('Error al cargar los productos.'); // Muestra error
      })
      .finally(() => {
        setIsLoading(false); // Finaliza la carga
      });
  }, [refreshProducts]); // Se ejecuta al cambiar el disparador

  // Añade un producto al carrito
  const addToCart = (productToAdd) => {
    // Valida que el producto tenga un ID válido o sea manual
    if (!productToAdd.id && !productToAdd.isManual) {
      toast.error('Producto inválido.');
      return;
    }
    const itemInCart = cart.find((item) => item.id === productToAdd.id);
    const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;
    // Valida el stock para productos no manuales
    if (!productToAdd.isManual && currentQuantityInCart >= productToAdd.stock) {
      toast.warn(`No hay más stock disponible para ${productToAdd.name}.`);
      return;
    }
    if (itemInCart) {
      // Actualiza la cantidad si el producto ya está en el carrito
      setCart(
        cart.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Añade un nuevo producto al carrito
      setCart([...cart, { ...productToAdd, quantity: 1 }]);
    }
  };

  // Cambia la cantidad de un ítem o añade uno manual
  const handleQuantityChange = (productId, amount, newItem = null) => {
    // Caso 1: Añade un nuevo ítem manual
    if (newItem) {
      setCart([...cart, { ...newItem, id: productId, quantity: amount }]);
      return;
    }

    // Busca el ítem en el carrito
    const itemInCart = cart.find((item) => item.id === productId);
    if (!itemInCart) return;

    // Caso 2: Ítem manual (no requiere validación de stock)
    if (itemInCart.isManual) {
      const newQuantity = itemInCart.quantity + amount;
      if (newQuantity <= 0) return; // No permite cantidad menor a 1
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
      return;
    }

    // Caso 3: Producto regular (valida stock)
    const productInCatalog = products.find((p) => p.id === productId);
    if (!productInCatalog) {
      toast.error('Producto no encontrado en el catálogo.');
      return;
    }

    const newQuantity = itemInCart.quantity + amount;
    // Valida el stock para productos regulares
    if (amount > 0 && newQuantity > productInCatalog.stock) {
      toast.warn(
        `No se puede añadir más de ${productInCatalog.name}. Stock máximo: ${productInCatalog.stock}.`
      );
      return;
    }

    // Actualiza el carrito
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean) // Elimina ítems con cantidad 0
    );
  };

  // Elimina un ítem del carrito
  const handleRemoveItem = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Finaliza la venta
  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío.');
      return;
    }
    // Prepara los datos para la API
    const saleData = {
      cart: cart.map(({ id, quantity, price, isManual, name }) => ({
        id: isManual ? null : id, // ID nulo para ítems manuales
        name: isManual
          ? name
          : products.find((p) => p.id === id)?.name || 'Producto desconocido',
        quantity,
        price: parseFloat(price),
        isManual: !!isManual,
      })),
      total: cart.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      ),
    };
    apiClient
      .post('/api/sales', saleData) // Envía la venta al backend
      .then((response) => {
        toast.success('¡Venta registrada con éxito!'); // Notifica éxito
        setCart([]); // Vacía el carrito
        apiClient.get('/api/products').then((res) => setProducts(res.data)); // Actualiza productos
        setRefreshProducts((prev) => !prev); // Dispara recarga
        onSaleSuccess(); // Llama a la función de éxito
      })
      .catch((error) => {
        console.error('Error al finalizar la venta:', error);
        toast.error(error.response?.data?.message || 'Error al registrar la venta.');
      });
  };

  return (
    <Grid container spacing={3}> {/* Layout de grilla */}
      {/* Catálogo de productos */}
      <Grid item xs={12} md={7}>
        <ProductCatalog
          products={products}
          isLoading={isLoading}
          onAddToCart={addToCart}
        />
      </Grid>
      {/* Carrito y calculadora */}
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