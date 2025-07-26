// frontend/src/components/categories/CategoryManager.js
import React, { useState, useEffect } from 'react'; // Importa React y hooks para estado y efectos
import apiClient from '../services/api'; // Cliente API para comunicarse con el backend
import { toast } from 'react-toastify'; // Notificaciones para el usuario
import {
  Box, // Contenedor flexible
  Typography, // Texto estilizado
  TextField, // Campo de texto para el formulario
  Button, // Botones interactivos
  Paper, // Contenedor tipo tarjeta
  List, // Lista de categorías
  ListItem, // Ítem de la lista
  ListItemText, // Texto del ítem
  IconButton, // Botones con íconos
} from '@mui/material'; // Componentes de Material-UI
import EditIcon from '@mui/icons-material/Edit'; // Ícono para editar
import DeleteIcon from '@mui/icons-material/Delete'; // Ícono para eliminar

// Componente CategoryManager: Gestiona la creación, edición y eliminación de categorías
const CategoryManager = () => {
  // Estado para la lista de categorías
  const [categories, setCategories] = useState([]);
  // Estado para el nombre de la nueva categoría o la categoría en edición
  const [newCategoryName, setNewCategoryName] = useState('');
  // Estado para la categoría que se está editando (null si no hay ninguna)
  const [editingCategory, setEditingCategory] = useState(null);

  // Función para cargar las categorías desde el backend
  const fetchCategories = () => {
    apiClient
      .get('/api/categories') // Solicita la lista de categorías
      .then((response) => setCategories(response.data)) // Guarda las categorías
      .catch(() => toast.error('Error al cargar categorías.')); // Muestra error
  };

  // Carga las categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []); // Sin dependencias, se ejecuta solo al montar

  // Maneja el envío del formulario (crear o actualizar categoría)
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    const action = editingCategory
      ? apiClient.put(`/api/categories/${editingCategory.id}`, {
          name: newCategoryName,
        }) // Actualiza la categoría
      : apiClient.post('/api/categories', { name: newCategoryName }); // Crea una nueva categoría

    action
      .then(() => {
        toast.success(
          `Categoría ${editingCategory ? 'actualizada' : 'creada'} con éxito.`
        ); // Notifica éxito
        setNewCategoryName(''); // Limpia el campo
        setEditingCategory(null); // Sale del modo edición
        fetchCategories(); // Recarga las categorías
      })
      .catch((error) =>
        toast.error(error.response?.data?.message || 'Ocurrió un error.')
      ); // Muestra error
  };

  // Elimina una categoría tras confirmación
  const handleDelete = (categoryId) => {
    if (window.confirm('¿Seguro que quieres eliminar esta categoría?')) {
      apiClient
        .delete(`/api/categories/${categoryId}`) // Envía solicitud de eliminación
        .then(() => {
          toast.info('Categoría eliminada.'); // Notifica éxito
          fetchCategories(); // Recarga las categorías
        })
        .catch(() => toast.error('Error al eliminar la categoría.')); // Muestra error
    }
  };

  // Inicia la edición de una categoría
  const startEdit = (category) => {
    setEditingCategory(category); // Guarda la categoría a editar
    setNewCategoryName(category.name); // Carga el nombre en el campo
  };

  // Cancela la edición
  const cancelEdit = () => {
    setEditingCategory(null); // Sale del modo edición
    setNewCategoryName(''); // Limpia el campo
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}> {/* Contenedor tipo tarjeta */}
      {/* Título */}
      <Typography variant="h4" gutterBottom>
        Gestión de Categorías
      </Typography>
      {/* Formulario para crear o editar categoría */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mb: 4, display: 'flex', gap: 2 }}
      >
        <TextField
          label={editingCategory ? 'Editar nombre de la categoría' : 'Nueva categoría'}
          variant="outlined"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          fullWidth
          required
        />
        {/* Botón para enviar el formulario */}
        <Button type="submit" variant="contained">
          {editingCategory ? 'Actualizar' : 'Añadir'}
        </Button>
        {/* Botón para cancelar la edición */}
        {editingCategory && <Button onClick={cancelEdit}>Cancelar</Button>}
      </Box>
      {/* Lista de categorías */}
      <List>
        {categories.map((category) => (
          <ListItem
            key={category.id}
            secondaryAction={
              <>
                {/* Botón para editar */}
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => startEdit(category)}
                >
                  <EditIcon />
                </IconButton>
                {/* Botón para eliminar */}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(category.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CategoryManager;