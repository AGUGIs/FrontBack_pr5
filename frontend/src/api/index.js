import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const api = {
    // Users
    getUsers: async () => {
        const response = await apiClient.get('/users');
        return response.data;
    },

    // Products
    getProducts: async () => {
        const response = await apiClient.get('/products');
        return response.data;
    },

    // Orders (с Relations и Aggregation)
    getOrders: async () => {
        const response = await apiClient.get('/orders');
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    },

    createOrder: async (order) => {
        const response = await apiClient.post('/orders', order);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await apiClient.patch(`/orders/${id}`, { status });
        return response.data;
    },

    deleteOrder: async (id) => {
        const response = await apiClient.delete(`/orders/${id}`);
        return response.data;
    },

    // Aggregation
    getOrderStats: async () => {
        const response = await apiClient.get('/stats/orders');
        return response.data;
    },

    getUserOrders: async (userId) => {
        const response = await apiClient.get(`/users/${userId}/orders`);
        return response.data;
    }
};