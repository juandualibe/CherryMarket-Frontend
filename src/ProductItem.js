import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { toast } from 'react-toastify';
import { Card, CardContent, CardActions, Typography, Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ProductItem = ({ product, onDataChanged }) => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState({ ...product });
    const [categories, setCategories] = useState([]);

    const handleClickOpen = () => {
        apiClient.get('/api/categories')
            .then(response => setCategories(response.data))
            .catch(() => toast.error('No se pudieron cargar las categorías.'));
        setOpen(true);
    };
    
    const handleClose = () => setOpen(false);

    const handleDelete = () => {
        if (window.confirm('¿Seguro que quieres eliminar?')) {
            apiClient.delete(`/api/products/${product.id}`)
                .then(() => { 
                    toast.info('Producto eliminado.'); 
                    onDataChanged(); 
                })
                .catch(() => toast.error('Error al eliminar.'));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        apiClient.put(`/api/products/${product.id}`, { ...editData, category_id: editData.category_id || null })
            .then(() => {
                toast.success('Producto actualizado.');
                handleClose();
                onDataChanged();
            })
            .catch(() => toast.error('Error al actualizar.'));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    return (
        <>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="text.secondary">
                        ${product.price} - Stock: {product.stock}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Categoría: {product.category_name || 'Sin asignar'}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={handleClickOpen}>Editar</Button>
                    <Button size="small" color="error" onClick={handleDelete}>Eliminar</Button>
                </CardActions>
            </Card>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Editar Producto</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField 
                            label="Nombre del producto" 
                            name="name" 
                            value={editData.name} 
                            onChange={handleInputChange} 
                        />
                        <TextField 
                            label="Precio"
                            name="price" 
                            type="number" 
                            value={editData.price} 
                            onChange={handleInputChange} 
                        />
                        <TextField 
                            label="Stock"
                            name="stock" 
                            type="number" 
                            value={editData.stock} 
                            onChange={handleInputChange} 
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel id="edit-category-select-label">Categoría</InputLabel>
                            <Select
                                labelId="edit-category-select-label"
                                name="category_id"
                                value={editData.category_id || ''}
                                label="Categoría"
                                onChange={handleInputChange}
                            >
                                <MenuItem value=""><em>Sin Categoría</em></MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleUpdate} variant="contained" color="primary">Guardar Cambios</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProductItem;