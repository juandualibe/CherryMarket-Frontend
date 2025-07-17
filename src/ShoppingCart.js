// frontend/src/ShoppingCart.js
import React from 'react';

const ShoppingCart = ({ cart, onQuantityChange, onRemoveItem, onFinalizeSale }) => {
    // Calculamos el total de la compra
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div>
            <h3>Carrito</h3>
            {cart.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className="product-item" style={{justifyContent: 'flex-start', gap: '10px'}}>
                            <div className="product-item-info">
                                {item.name} (${item.price})
                            </div>
                            <div className="product-item-actions">
                                <button onClick={() => onQuantityChange(item.id, -1)}>-</button>
                                <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                                <button onClick={() => onQuantityChange(item.id, 1)}>+</button>
                                <button onClick={() => onRemoveItem(item.id)} className="btn-delete" style={{marginLeft: '10px'}}>X</button>
                            </div>
                        </div>
                    ))}
                    <hr />
                    <h4>Total: ${total.toFixed(2)}</h4>
                    <button onClick={onFinalizeSale} style={{ width: '100%', backgroundColor: '#2ecc71', color: 'white' }}>
                        Finalizar Venta
                    </button>
                </>
            )}
        </div>
    );
};

export default ShoppingCart;