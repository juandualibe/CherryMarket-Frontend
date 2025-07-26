// frontend/src/components/management/ProductItem.js
import React, { useState, useEffect } from 'react'; // Importa React y hooks para estado y efectos
import apiClient from '../../services/api'; // Cliente API para comunicarse con el backend
import { toast } from 'react-toastify'; // Notificaciones para el usuario
import {
  Card, // Contenedor tipo tarjeta para el producto
  CardContent, // Contenido de la tarjeta
  CardActions, // Acciones (botones) de la tarjeta
  Typography, // Texto estilizado
  Button, // Botón interactivo
  TextField, // Campo de texto para edición
  Box, // Contenedor flexible
  Dialog, // Diálogo para editar el producto
  DialogActions, // Botones del diálogo
  DialogContent, // Contenido del diálogo
  DialogTitle, // Título del diálogo
  FormControl, // Contenedor para el selector
  InputLabel, // Etiqueta para el selector
  Select, // Selector desplegable
  MenuItem, // Opción del selector
} from '@mui/material'; // Componentes de Material-UI

// Componente ProductItem: Muestra un producto con opciones para editar o eliminar
// Props:
// - product: Objeto con los datos del producto
// - onDataChanged: Función para notificar cambios en los datos
const ProductItem = ({ product, onDataChanged }) => {
  // Estado para controlar el diálogo de edición
  const [open, setOpen] = useState(false);
  // Estado para los datos editados del producto
  const [editData, setEditData] = useState({ ...product });
  // Estado para la lista de categorías
  const [categories, setCategories] = useState([]);

  // Abre el diálogo de edición y carga las categorías
  const handleClickOpen = () => {
    apiClient
      .get('/api/categories') // Solicita la lista de categorías
      .then((response) => setCategories(response.data)) // Guarda las categorías
      .catch(() => toast.error('No se pudieron cargar las categorías.')); // Muestra error
    setOpen(true);
  };

  // Cierra el diálogo de edición
  const handleClose = () => setOpen(false);

  // Elimina el producto tras confirmación
  const handleDelete = () => {
    if (window.confirm('¿Seguro que quieres eliminar?')) {
      apiClient
        .delete(`/api/products/${product.id}`) // Envía solicitud de eliminación al backend
        .then(() => {
          toast.info('Producto eliminado.'); // Notifica éxito
          onDataChanged(); // Notifica cambios
        })
        .catch(() => toast.error('Error al eliminar.')); // Muestra error
    }
  };

  // Actualiza el producto con los datos editados
  const handleUpdate = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto
    apiClient
      .put(`/api/products/${product.id}`, {
        ...editData,
        category_id: editData.category_id || null, // Asegura que la categoría sea null si no se selecciona
      }) // Envía los datos actualizados
      .then(() => {
        toast.success('Producto actualizado.'); // Notifica éxito
        handleClose(); // Cierra el diálogo
        onDataChanged(); // Notifica cambios
      })
      .catch(() => toast.error('Error al actualizar.')); // Muestra error
  };

  // Maneja los cambios en los campos del formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value }); // Actualiza el estado con el nuevo valor
  };

  return (
    <>
      {/* Tarjeta que muestra los datos del producto */}
      <Card
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Nombre del producto */}
          <Typography variant="h6">{product.name}</Typography>
          {/* Precio y stock */}
          <Typography color="text.secondary">
            ${product.price} - Stock: {product.stock}
          </Typography>
          {/* Categoría */}
          <Typography variant="caption" color="text.secondary">
            Categoría: {product.category_name || 'Sin asignar'}
          </Typography>
        </CardContent>
        <CardActions>
          {/* Botón para abrir el diálogo de edición */}
          <Button size="small" onClick={handleClickOpen}>
            Editar
          </Button>
          {/* Botón para eliminar el producto */}
          <Button size="small" color="error" onClick={handleDelete}>
            Eliminar
          </Button>
        </CardActions>
      </Card>

      {/* Diálogo para editar el producto */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          {/* Formulario de edición */}
          <Box
            component="form"
            onSubmit={handleUpdate}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
          >
            {/* Campo para el nombre */}
            <TextField
              label="Nombre del producto"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
            />
            {/* Campo para el precio */}
            <TextField
              label="Precio"
              name="price"
              type="number"
              value={editData.price}
              onChange={handleInputChange}
            />
            {/* Campo para el stock */}
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={editData.stock}
              onChange={handleInputChange}
            />
            {/* Selector de categorías */}
            <FormControl fullWidth>
              <InputLabel id="edit-category-select-label">Categoría</InputLabel>
              <Select
                labelId="edit-category-select-label"
                name="category_id"
                value={editData.category_id || ''}
                label="Categoría"
                onChange={handleInputChange}
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
          </Box>
        </DialogContent>
        <DialogActions>
          {/* Botón para cancelar */}
          <Button onClick={handleClose}>Cancelar</Button>
          {/* Botón para guardar cambios */}
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductItem;