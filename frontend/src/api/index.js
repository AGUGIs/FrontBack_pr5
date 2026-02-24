import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

export const api = {
  // Получить все товары
  getProducts: async () => {
    const response = await apiClient.get("/products");
    return response.data;
  },

  // Получить товар по ID
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Создать новый товар
  createProduct: async (product) => {
    const response = await apiClient.post("/products", product);
    return response.data;
  },

  // Обновить товар
  updateProduct: async (id, product) => {
    const response = await apiClient.patch(`/products/${id}`, product);
    return response.data;
  },

  // Удалить товар
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
  
  // Получить статистику (если есть такой эндпоинт в вашем backend)
  getStats: async () => {
      try {
          const response = await apiClient.get("/stats/orders"); 
          return response.data;
      } catch (e) {
          return null; // Если эндпоинта нет, игнорируем ошибку
      }
  }
};