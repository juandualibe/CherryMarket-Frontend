// frontend/src/ProductItem.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // 1. Importamos toast

const ProductItem = ({ product, onDataChanged }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...product });

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            axios.delete(`http://localhost:5000/api/products/${product.id}`)
                .then(() => {
                    // 2. Reemplazamos el feedback por un toast
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
        axios.put(`http://localhost:5000/api/products/${product.id}`, editData)
            .then(() => {
                // 3. Añadimos un toast de éxito
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

    // --- VISTA NORMAL (SIN EDITAR) ---
    if (!isEditing) {
        return (
            <li className="product-item">
                <div className="product-item-info">
                    {product.name} - ${product.price} (Stock: {product.stock})
                </div>
                <div className="product-item-actions">
                    <button onClick={() => setIsEditing(true)} className="btn-edit">Editar</button>
                    <button onClick={handleDelete} className="btn-delete">Eliminar</button>
                </div>
            </li>
        );
    }

    // --- VISTA DE EDICIÓN ---
    return (
        <li className="product-item">
            <form onSubmit={handleUpdate} className="product-edit-form">
                <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="edit-input" />
                <input type="number" name="price" value={editData.price} onChange={handleInputChange} className="edit-input" />
                <input type="number" name="stock" value={editData.stock} onChange={handleInputChange} className="edit-input" />
                <div className="product-item-actions">
                    <button type="submit" className="btn-save">Guardar</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                </div>
            </form>
        </li>
    );
};

export default ProductItem;