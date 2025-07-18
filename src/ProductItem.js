import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent, CardActions, Typography, Button, TextField, Box } from '@mui/material';


const ProductItem = ({ product, onDataChanged }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...product });

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${product.id}`)
                .then(() => {
                    toast.info('Producto eliminado.');
                    onDataChanged();
                })
                .catch(error => {
                    console.error('Error al eliminar:', error);
                    toast.error('Error al eliminar el producto.');
                });
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`${process.env.REACT_APP_API_URL}/api/products/${product.id}`, editData)
            .then(() => {
                toast.success('Producto actualizado.');
                setIsEditing(false);
                onDataChanged();
            })
            .catch(error => {
                console.error('Error al actualizar:', error);
                toast.error('Error al actualizar el producto.');
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    // Este return asume que ya refactorizaste a MUI.
    if (!isEditing) {
        return (
            <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="text.secondary">
                        ${product.price} - Stock: {product.stock}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => setIsEditing(true)}>Editar</Button>
                    <Button size="small" color="error" onClick={handleDelete}>Eliminar</Button>
                </CardActions>
            </Card>
        );
    }
    
    return (
        <Card sx={{ mb: 2, p: 2 }}>
            <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField size="small" name="name" value={editData.name} onChange={handleInputChange} sx={{ flex: 3 }} />
                <TextField size="small" name="price" type="number" value={editData.price} onChange={handleInputChange} sx={{ flex: 1 }} />
                <TextField size="small" name="stock" type="number" value={editData.stock} onChange={handleInputChange} sx={{ flex: 1 }} />
                <Button type="submit" size="small" variant="contained" color="success">Guardar</Button>
                <Button size="small" onClick={() => setIsEditing(false)}>Cancelar</Button>
            </Box>
        </Card>
    );
};

export default ProductItem;