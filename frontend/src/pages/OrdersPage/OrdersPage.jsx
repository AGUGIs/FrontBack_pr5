import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import OrdersList from '../../components/OrdersList';
import OrderModal from '../../components/OrderModal';
import StatsCard from '../../components/StatsCard';
import './OrdersPage.scss';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [ordersData, statsData] = await Promise.all([
                api.getOrders(),
                api.getOrderStats()
            ]);
            setOrders(ordersData);
            setStats(statsData);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleCreateOrder = async (payload) => {
        try {
            await api.createOrder(payload);
            await loadData();
            closeModal();
        } catch (err) {
            console.error(err);
            alert('Ошибка создания заказа');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.updateOrderStatus(id, status);
            await loadData();
        } catch (err) {
            console.error(err);
            alert('Ошибка обновления статуса');
        }
    };

    const handleDelete = async (id) => {
        const ok = window.confirm('Удалить этот заказ?');
        if (!ok) return;
        try {
            await api.deleteOrder(id);
            await loadData();
        } catch (err) {
            console.error(err);
            alert('Ошибка удаления заказа');
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">🍳 Магазин Кастрюль - Заказы</div>
                    <div className="header__right">Practice 5: Relations + Aggregation</div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Управление заказами</h1>
                        <button className="btn btn--primary" onClick={openCreate}>
                            + Новый заказ
                        </button>
                    </div>

                    {stats && <StatsCard stats={stats} />}

                    {loading ? (
                        <div className="empty">Загрузка...</div>
                    ) : (
                        <OrdersList
                            orders={orders}
                            onUpdateStatus={handleUpdateStatus}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">
                    © {new Date().getFullYear()} Магазин Кастрюль - Practice 5
                </div>
            </footer>

            <OrderModal
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleCreateOrder}
            />
        </div>
    );
}