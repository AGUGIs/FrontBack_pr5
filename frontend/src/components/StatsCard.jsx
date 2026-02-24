import React from 'react';

export default function StatsCard({ stats }) {
    return (
        <div className="stats-card">
            <div className="stats-item">
                <div className="stats-value">{stats.totalOrders}</div>
                <div className="stats-label">Всего заказов</div>
            </div>
            <div className="stats-item">
                <div className="stats-value">{stats.totalRevenue} ₽</div>
                <div className="stats-label">Выручка</div>
            </div>
            <div className="stats-item">
                <div className="stats-value">{stats.averageOrderValue.toFixed(0)} ₽</div>
                <div className="stats-label">Средний чек</div>
            </div>
            <div className="stats-item">
                <div className="stats-value">{stats.byStatus.pending}</div>
                <div className="stats-label">Ожидают</div>
            </div>
        </div>
    );
}