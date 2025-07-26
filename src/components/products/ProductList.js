// frontend/src/components/management/ProductList.js
import React from 'react'; // Importa React
import ProductItem from './ProductItem'; // Componente para mostrar cada producto
import {
  Typography, // Texto estilizado para el título
  Box, // Contenedor flexible
  CircularProgress, // Indicador de carga
} from '@mui/material'; // Componentes de Material-UI

// Componente ProductList: Muestra una lista de productos
// Props:
// - products: Array de productos a mostrar
// - isLoading: Booleano que indica si los datos están cargando
// - onDataChanged: Función para notificar cambios en los datos
const ProductList = ({ products, isLoading, onDataChanged }) => {
  return (
    <Box>
      {/* Título de la lista */}
      <Typography variant="h5" component="h3" gutterBottom>
        Lista de Productos
      </Typography>
      {/* Muestra un indicador de carga si isLoading es true */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {/* Mapea los productos y renderiza un ProductItem por cada uno */}
          {products.map((product) => (
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