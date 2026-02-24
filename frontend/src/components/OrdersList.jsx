import React from 'react';
import OrderItem from './OrderItem';

export default function OrdersList({ orders, onUpdateStatus, onDelete }) {
    if (!orders.length) {
        return <div className="empty">Заказов пока нет</div>;
    }

    return (
        <div className="list">
            {orders.map(order => (
                <OrderItem
                    key={order.id}
                    order={order}
                    onUpdateStatus={onUpdateStatus}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}