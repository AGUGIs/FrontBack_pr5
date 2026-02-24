import React from 'react';

export default function OrderItem({ order, onUpdateStatus, onDelete }) {
    const statusColors = {
        pending: '#fbbf24',
        processing: '#3b82f6',
        completed: '#4ade80',
        cancelled: '#ef4444'
    };

    const statusLabels = {
        pending: 'Ожидает',
        processing: 'В обработке',
        completed: 'Выполнен',
        cancelled: 'Отменён'
    };

    return (
        <div className="order-card">
            <div className="order-card__header">
                <div className="order-card__id">Заказ #{order.id}</div>
                <div
                    className="order-card__status"
                    style={{ backgroundColor: statusColors[order.status] }}
                >
                    {statusLabels[order.status]}
                </div>
            </div>

            <div className="order-card__body">
                <div className="order-card__user">
                    <strong>Клиент:</strong> {order.userName} ({order.userEmail})
                </div>
                <div className="order-card__date">
                    <strong>Дата:</strong> {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                </div>
                <div className="order-card__items">
                    <strong>Товары:</strong> {order.totalItems} шт.
                </div>
                <div className="order-card__total">
                    <strong>Сумма:</strong> {order.totalAmount} ₽
                </div>
            </div>

            <div className="order-card__actions">
                <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    className="status-select"
                >
                    <option value="pending">Ожидает</option>
                    <option value="processing">В обработке</option>
                    <option value="completed">Выполнен</option>
                    <option value="cancelled">Отменён</option>
                </select>
                <button className="btn btn--danger" onClick={() => onDelete(order.id)}>
                    Удалить
                </button>
            </div>
        </div>
    );
}