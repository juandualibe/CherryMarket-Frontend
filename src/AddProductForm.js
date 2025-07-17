// frontend/src/AddProductForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // 1. Importamos toast

// 1. CAMBIAMOS EL NOMBRE DE LA PROP AQUÍ
const AddProductForm = ({ onDataChanged }) => {
    // Un estado para cada campo del formulario
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [barcode, setBarcode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Previene que la página se recargue al enviar

        const newProduct = {
            name,
            price: parseFloat(price), // Convertimos el precio a número
            stock: parseInt(stock, 10), // Convertimos el stock a número
            barcode
        };

        axios.post('http://localhost:5000/api/products', newProduct)
            .then(response => {
                // 2. Reemplazamos alert por toast.success
                toast.success('¡Producto añadido con éxito!');
                // ... (limpiamos el formulario)
                onDataChanged();
            })
            .catch(error => {
                // 3. Reemplazamos el alert de error
                toast.error('Error al añadir producto.');
                console.error('Hubo un error al añadir el producto:', error);
            });
    };


    return (
        <form onSubmit={handleSubmit}>
            <h3>Añadir Nuevo Producto</h3>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre del producto"
                required
            />
            <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Precio"
                required
            />
            <input
                type="number"
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="Stock"
            />
            <input
                type="text"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                placeholder="Código de barras"
            />
            <button type="submit">Añadir Producto</button>
        </form>
    );
};

export default AddProductForm;