import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { toast } from 'react-toastify';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null); // Para guardar {id, name} de la categoría en edición

    const fetchCategories = () => {
        apiClient.get('/api/categories')
            .then(response => setCategories(response.data))
            .catch(() => toast.error('Error al cargar categorías.'));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = editingCategory 
            ? apiClient.put(`/api/categories/${editingCategory.id}`, { name: newCategoryName })
            : apiClient.post('/api/categories', { name: newCategoryName });

        action.then(() => {
            toast.success(`Categoría ${editingCategory ? 'actualizada' : 'creada'} con éxito.`);
            setNewCategoryName('');
            setEditingCategory(null);
            fetchCategories(); // Recargar la lista
        }).catch(error => {
            toast.error(error.response?.data?.message || 'Ocurrió un error.');
        });
    };

    const handleDelete = (categoryId) => {
        if (window.confirm('¿Seguro que quieres eliminar esta categoría?')) {
            apiClient.delete(`/api/categories/${categoryId}`)
                .then(() => {
                    toast.info('Categoría eliminada.');
                    fetchCategories();
                })
                .catch(() => toast.error('Error al eliminar la categoría.'));
        }
    };

    const startEdit = (category) => {
        setEditingCategory(category);
        setNewCategoryName(category.name);
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        setNewCategoryName('');
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Gestión de Categorías</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, display: 'flex', gap: 2 }}>
                <TextField
                    label={editingCategory ? "Editar nombre de la categoría" : "Nueva categoría"}
                    variant="outlined"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained">{editingCategory ? 'Actualizar' : 'Añadir'}</Button>
                {editingCategory && <Button onClick={cancelEdit}>Cancelar</Button>}
            </Box>
            <List>
                {categories.map(category => (
                    <ListItem key={category.id} secondaryAction={
                        <>
                            <IconButton edge="end" aria-label="edit" onClick={() => startEdit(category)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(category.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }>
                        <ListItemText primary={category.name} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default CategoryManager;