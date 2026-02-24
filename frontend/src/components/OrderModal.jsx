import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function OrderModal({ open, onClose, onSubmit }) {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        if (!open) return;
        loadUsersAndProducts();
    }, [open]);

    const loadUsersAndProducts = async () => {
        try {
            const [usersData, productsData] = await Promise.all([
                api.getUsers(),
                api.getProducts()
            ]);
            setUsers(usersData);
            setProducts(productsData);
        } catch (err) {
            console.error(err);
        }
    };

    const addProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product && !selectedProducts.find(p => p.productId === productId)) {
            setSelectedProducts([...selectedProducts, {
                productId: product.id,
                quantity: 1,
                price: product.price
            }]);
        }
    };

    const updateQuantity = (productId, quantity) => {
        setSelectedProducts(selectedProducts.map(p =>
            p.productId === productId ? { ...p, quantity: Number(quantity) } : p
        ));
    };

    const removeProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userId || selectedProducts.length === 0) {
            alert('Выберите клиента и хотя бы один товар');
            return;
        }
        onSubmit({ userId, items: selectedProducts });
    };

    if (!open) return null;

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div className="modal__title">Новый заказ</div>
                    <button className="iconBtn" onClick={onClose}>✕</button>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Клиент
                        <select
                            className="input"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        >
                            <option value="">Выберите клиента</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="label">
                        Добавить товар
                        <select
                            className="input"
                            onChange={(e) => addProduct(e.target.value)}
                            value=""
                        >
                            <option value="">Выберите товар</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - {product.price} ₽
                                </option>
                            ))}
                        </select>
                    </label>

                    {selectedProducts.length > 0 && (
                        <div className="selected-products">
                            <h4>Выбранные товары:</h4>
                            {selectedProducts.map(item => {
                                const product = products.find(p => p.id === item.productId);
                                return (
                                    <div key={item.productId} className="selected-item">
                                        <span>{product?.name}</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.productId, e.target.value)}
                                            className="quantity-input"
                                        />
                                        <span>{item.price * item.quantity} ₽</span>
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeProduct(item.productId)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>Отмена</button>
                        <button type="submit" className="btn btn--primary">Создать заказ</button>
                    </div>
                </form>
            </div>
        </div>
    );
}