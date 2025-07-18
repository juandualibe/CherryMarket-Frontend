import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent, CardActions, Typography, Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ProductItem = ({ product, onDataChanged }) => {
    // 1. Cambiamos 'isEditing' por 'open' para controlar el modal
    const [open, setOpen] = useState(false); 
    const [editData, setEditData] = useState({ ...product });

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDelete = () => {
        if (window.confirm('¿Seguro que quieres eliminar?')) {
            axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${product.id}`)
                .then(() => { toast.info('Producto eliminado.'); onDataChanged(); })
                .catch(() => toast.error('Error al eliminar.'));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`${process.env.REACT_APP_API_URL}/api/products/${product.id}`, editData)
            .then(() => { 
                toast.success('Producto actualizado.'); 
                handleClose(); // Cerramos el modal
                onDataChanged(); 
            })
            .catch(() => toast.error('Error al actualizar.'));
    };
    
    const handleInputChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

    return (
        <>
            {/* Esta es la vista normal del producto, siempre visible */}
            <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="text.secondary">
                        ${product.price} - Stock: {product.stock}
                    </Typography>
                </CardContent>
                <CardActions>
                    {/* 2. El botón editar ahora abre el modal */}
                    <Button size="small" onClick={handleClickOpen}>Editar</Button>
                    <Button size="small" color="error" onClick={handleDelete}>Eliminar</Button>
                </CardActions>
            </Card>

            {/* 3. Este es el Modal (Dialog) que se abre para editar */}
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