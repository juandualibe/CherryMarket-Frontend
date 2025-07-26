// frontend/src/components/sales/ProductCatalog.js
import React, { useState, useEffect } from 'react'; // Importa React y hooks para estado y efectos
import apiClient from '../../services/api'; // Cliente API para comunicarse con el backend
import {
  Typography, // Texto estilizado para el título
  Box, // Contenedor flexible
  Paper, // Contenedor tipo tarjeta
  Grid, // Sistema de grilla para el layout
  Button, // Botón interactivo
  Chip, // Etiqueta clicable para categorías
  CircularProgress, // Indicador de carga
  TextField, // Campo de texto para búsqueda
} from '@mui/material'; // Componentes de Material-UI
import { toast } from 'react-toastify'; // Notificaciones para el usuario

// Componente ProductCatalog: Muestra un catálogo de productos con búsqueda y filtros
// Props:
// - products: Array de productos a mostrar
// - isLoading: Booleano que indica si los datos están cargando
// - onAddToCart: Función para añadir un producto al carrito
const ProductCatalog = ({ products, isLoading, onAddToCart }) => {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  // Estado para los productos filtrados
  const [filteredProducts, setFilteredProducts] = useState([]);
  // Estado para la lista de categorías
  const [categories, setCategories] = useState([]);
  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Efecto para cargar las categorías al montar el componente
  useEffect(() => {
    apiClient
      .get('/api/categories') // Solicita la lista de categorías
      .then((response) => setCategories(response.data)) // Guarda las categorías
      .catch(() => toast.error('Error al cargar las categorías.')); // Muestra error
  }, []); // Se ejecuta solo al montar el componente

  // Efecto para filtrar productos según búsqueda y categoría
  useEffect(() => {
    let results = products; // Comienza con todos los productos

    // Filtra por categoría si no es 'all'
    if (selectedCategory !== 'all') {
      results = results.filter(
        (product) => product.category_id === selectedCategory
      );
    }

    // Filtra por término de búsqueda
    if (searchTerm) {
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.barcode && product.barcode.includes(searchTerm))
      );
    }

    setFilteredProducts(results); // Actualiza los productos filtrados
  }, [searchTerm, products, selectedCategory]); // Se ejecuta cuando cambian estas dependencias

  // Maneja el escaneo de códigos de barras
  const handleBarcodeScan = (event) => {
    if (event.key === 'Enter' && searchTerm.trim() !== '') {
      event.preventDefault(); // Evita el comportamiento por defecto del Enter
      // Busca un producto con el código de barras exacto
      const foundProduct = products.find((p) => p.barcode === searchTerm.trim());
      if (foundProduct) {
        onAddToCart(foundProduct); // Añade el producto al carrito
        setSearchTerm(''); // Limpia la búsqueda
      } else {
        toast.warn('Producto no encontrado por código de barras.');
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}> {/* Contenedor tipo tarjeta */}
      {/* Título del catálogo */}
      <Typography variant="h5" component="h3" gutterBottom>
        Catálogo de Productos
      </Typography>
      {/* Campo de búsqueda */}
      <TextField
        fullWidth
        label="Buscar por nombre o escanear código de barras..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleBarcodeScan} // Detecta el escaneo de códigos de barras
        sx={{ mb: 2 }}
      />
      {/* Filtros por categoría */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="Todos"
          clickable
          color={selectedCategory === 'all' ? 'primary' : 'default'}
          onClick={() => setSelectedCategory('all')}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            clickable
            color={selectedCategory === category.id ? 'primary' : 'default'}
            onClick={() => setSelectedCategory(category.id)}
          />
        ))}
      </Box>
      {/* Muestra un indicador de carga si isLoading es true */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {/* Mapea los productos filtrados */}
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={6} sm={4} md={3}>
              <Paper
                sx={{
                  p: 1,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Nombre del producto */}
                <Typography variant="subtitle2" component="strong">
                  {product.name}
                </Typography>
                {/* Precio */}
                <Typography variant="body2">${product.price}</Typography>
                {/* Stock */}
                <Typography variant="caption">Stock: {product.stock}</Typography>
                {/* Botón para añadir al carrito */}
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