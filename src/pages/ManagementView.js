// frontend/src/pages/ManagementView.js
import React, { useState, useEffect } from 'react'; // Importa React y hooks para estado y efectos
import apiClient from '../services/api'; // Cliente API para comunicarse con el backend
import { toast } from 'react-toastify'; // Notificaciones para el usuario
import ProductList from '../components/products/ProductList'; // Componente para mostrar la lista de productos
import AddProductForm from '../components/products/AddProductForm'; // Componente para añadir productos
import { Box } from '@mui/material'; // Contenedor flexible de Material-UI

// Componente ManagementView: Gestiona la visualización y adición de productos
const ManagementView = () => {
  // Estado para la lista de productos
  const [products, setProducts] = useState([]);
  // Estado para indicar si los datos están cargando
  const [isLoading, setIsLoading] = useState(false);
  // Estado para disparar la recarga de productos
  const [refresh, setRefresh] = useState(false);

  // Función para recargar los productos
  const handleDataChange = () => {
    setRefresh(!refresh); // Alterna el estado para disparar el useEffect
  };

  // Carga los productos desde el backend
  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get('/api/products') // Solicita la lista de productos
      .then((response) => {
        setProducts(response.data); // Guarda los productos
      })
      .catch(() => {
        toast.error('Error al cargar productos.'); // Muestra error
      })
      .finally(() => {
        setIsLoading(false); // Finaliza la carga
      });
  }, [refresh]); // Se ejecuta al cambiar el disparador

  return (
    <Box>
      {/* Formulario para añadir productos */}
      <AddProductForm onDataChanged={handleDataChange} />
      {/* Lista de productos */}
      <ProductList
        products={products}
        isLoading={isLoading}
        onDataChanged={handleDataChange}
      />
    </Box>
  );
};

export default ManagementView;