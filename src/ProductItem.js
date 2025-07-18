import React, { useState } from 'react';
import apiClient from './api'; // 1. Cambiamos la importación
import { toast } from 'react-toastify';
import { Card, CardContent, CardActions, Typography, Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ProductItem = ({ product, onDataChanged }) => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState({ ...product });

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDelete = () => {
        if (window.confirm('¿Seguro que quieres eliminar?')) {
            // 2. Usamos apiClient en lugar de axios
            apiClient.delete(`/api/products/${product.id}`)
                .then(() => { toast.info('Producto eliminado.'); onDataChanged(); })
                .catch(() => toast.error('Error al eliminar.'));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        // 3. Usamos apiClient en lugar de axios
        apiClient.put(`/api/products/${product.id}`, editData)
            .then(() => {
                toast.success('Producto actualizado.');
                handleClose();
                onDataChanged();
            })
            .catch(() => toast.error('Error al actualizar.'));
    };
    
    const handleInputChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

    return (
        <>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="text.secondary">
                        ${product.price} - Stock: {product.stock}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={handleClickOpen}>Editar</Button>
                    <Button size="small" color="error" onClick={handleDelete}>Eliminar</Button>
                </CardActions>
            </Card>

            <Dialog open={open} onClose={handleClose}>
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