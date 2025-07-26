// frontend/src/components/management/AddProductForm.js
import React, { useState, useEffect } from 'react'; // Importa React y hooks para estado y efectos
import apiClient from '../../services/api'; // Cliente API para comunicarse con el backend
import { toast } from 'react-toastify'; // Notificaciones para el usuario
import {
  Box, // Contenedor flexible para el formulario
  TextField, // Campo de texto para entrada de datos
  Button, // Botón para enviar el formulario
  Typography, // Texto estilizado para el título
  Paper, // Contenedor tipo tarjeta
  FormControl, // Contenedor para el selector
  InputLabel, // Etiqueta para el selector
  Select, // Selector desplegable
  MenuItem, // Opción del selector
} from '@mui/material'; // Componentes de Material-UI

// Componente AddProductForm: Formulario para añadir un nuevo producto
// Props:
// - onDataChanged: Función para notificar cambios en los datos
const AddProductForm = ({ onDataChanged }) => {
  // Estados para los campos del formulario
  const [name, setName] = useState(''); // Nombre del producto
  const [price, setPrice] = useState(''); // Precio del producto
  const [stock, setStock] = useState(''); // Stock del producto
  const [barcode, setBarcode] = useState(''); // Código de barras
  const [categoryId, setCategoryId] = useState(''); // ID de la categoría seleccionada
  const [categories, setCategories] = useState([]); // Lista de categorías disponibles

  // Efecto para cargar las categorías al montar el componente
  useEffect(() => {
    apiClient
      .get('/api/categories') // Solicita la lista de categorías al backend
      .then((response) => setCategories(response.data)) // Guarda las categorías en el estado
      .catch(() => toast.error('No se pudieron cargar las categorías.')); // Muestra error si falla
  }, []); // Se ejecuta solo al montar el componente

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    // Crea el objeto del nuevo producto
    const newProduct = {
      name,
      price,
      stock,
      barcode,
      category_id: categoryId, // Incluye la categoría seleccionada
    };
    apiClient
      .post('/api/products', newProduct) // Envía el producto al backend
      .then(() => {
        toast.success('¡Producto añadido con éxito!'); // Notifica éxito
        // Limpia los campos del formulario
        setName('');
        setPrice('');
        setStock('');
        setBarcode('');
        setCategoryId('');
        onDataChanged(); // Notifica que los datos han cambiado
      })
      .catch(() => toast.error('Error al añadir producto.')); // Muestra error si falla
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}> {/* Contenedor tipo tarjeta */}
      {/* Título del formulario */}
      <Typography variant="h5" component="h3" gutterBottom>
        Añadir Nuevo Producto
      </Typography>
      {/* Formulario para añadir producto */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {/* Campo para el nombre */}
        <TextField
          label="Nombre del producto"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {/* Campo para el precio */}
        <TextField
          label="Precio"
          type="number"
          variant="outlined"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        {/* Campo para el stock */}
        <TextField
          label="Stock"
          type="number"
          variant="outlined"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        {/* Campo para el código de barras */}
        <TextField
          label="Código de barras"
          variant="outlined"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        {/* Selector de categorías */}
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Categoría</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={categoryId}
            label="Categoría"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <MenuItem value="">
              <em>Sin Categoría</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Botón para enviar el formulario */}
        <Button type="submit" variant="contained" color="primary">
          Añadir Producto
        </Button>
      </Box>
    </Paper>
  );
};

export default AddProductForm;