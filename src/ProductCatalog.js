// frontend/src/ProductCatalog.js
import React, { useState, useEffect } from 'react';

// Recibe los productos y el estado de carga como props
const ProductCatalog = ({ products, isLoading, onAddToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.barcode && product.barcode.includes(searchTerm))
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);


    return (
        <div>
            <h3>Catálogo de Productos</h3>
            <input
                type="text"
                placeholder="Buscar por nombre o código de barras..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '95%', padding: '10px', marginBottom: '20px' }}
            />

            {isLoading ? <p>Cargando...</p> : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {filteredProducts.map(product => (
                        <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '150px' }}>
                            <strong>{product.name}</strong>
                            <p>${product.price}</p>
                            <p>Stock: {product.stock}</p>
                            {/* Deshabilitamos el botón si no hay stock */}
                            <button onClick={() => onAddToCart(product)} disabled={product.stock === 0} style={{ width: '100%' }}>
                                {product.stock === 0 ? 'Sin Stock' : 'Añadir'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;