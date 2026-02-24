const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Логирование запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}][${req.method}] ${res.statusCode} ${req.path}`);
    });
    next();
});

// === БАЗА ДАННЫХ (связанные сущности) ===

// Пользователи
let users = [
    { id: nanoid(6), name: 'Иван Петров', email: 'ivan@example.com', phone: '+7-900-111-22-33' },
    { id: nanoid(6), name: 'Мария Сидорова', email: 'maria@example.com', phone: '+7-900-444-55-66' },
    { id: nanoid(6), name: 'Алексей Козлов', email: 'alex@example.com', phone: '+7-900-777-88-99' }
];

// Товары (кастрюли)
let products = [
    { id: nanoid(6), name: 'Кастрюля "Шеф-Повар" 20л', category: 'Кастрюли', price: 5990, quantity: 15 },
    { id: nanoid(6), name: 'Кастрюля эмалированная 5л', category: 'Кастрюли', price: 1200, quantity: 30 },
    { id: nanoid(6), name: 'Казан чугунный 12л', category: 'Казаны', price: 3500, quantity: 8 },
    { id: nanoid(6), name: 'Сотейник антипригарный', category: 'Сотейники', price: 2100, quantity: 20 },
    { id: nanoid(6), name: 'Сковорода гриль 28см', category: 'Сковороды', price: 2500, quantity: 12 },
    { id: nanoid(6), name: 'Ковш для молока 1.5л', category: 'Ковши', price: 890, quantity: 40 },
    { id: nanoid(6), name: 'Утятница керамическая', category: 'Формы', price: 3200, quantity: 6 },
    { id: nanoid(6), name: 'Пароварка бамбуковая', category: 'Аксессуары', price: 1500, quantity: 10 },
    { id: nanoid(6), name: 'Турка медная 500мл', category: 'Кофе', price: 1100, quantity: 18 },
    { id: nanoid(6), name: 'Вок сковорода 32см', category: 'Сковороды', price: 2800, quantity: 9 }
];

// Заказы (связь: User → Orders → OrderItems → Products)
let orders = [
    { 
        id: nanoid(6), 
        userId: users[0].id, 
        status: 'completed', 
        createdAt: new Date('2026-02-01').toISOString(),
        items: [
            { productId: products[0].id, quantity: 2, price: 5990 },
            { productId: products[1].id, quantity: 1, price: 1200 }
        ]
    },
    { 
        id: nanoid(6), 
        userId: users[1].id, 
        status: 'pending', 
        createdAt: new Date('2026-02-10').toISOString(),
        items: [
            { productId: products[2].id, quantity: 1, price: 3500 }
        ]
    },
    { 
        id: nanoid(6), 
        userId: users[0].id, 
        status: 'processing', 
        createdAt: new Date('2026-02-15').toISOString(),
        items: [
            { productId: products[4].id, quantity: 1, price: 2500 },
            { productId: products[5].id, quantity: 3, price: 890 }
        ]
    }
];

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

// Функция для получения заказа с данными пользователя и товаров (JOIN/Aggregation)
function getOrderWithRelations(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    const user = users.find(u => u.id === order.userId);
    const itemsWithProducts = order.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
            ...item,
            product: product ? {
                id: product.id,
                name: product.name,
                category: product.category
            } : null
        };
    });

    const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
        ...order,
        user,
        items: itemsWithProducts,
        totalAmount
    };
}

// Функция для получения всех заказов с агрегацией
function getAllOrdersWithAggregation() {
    return orders.map(order => {
        const user = users.find(u => u.id === order.userId);
        const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

        return {
            ...order,
            userName: user ? user.name : 'Unknown',
            userEmail: user ? user.email : 'Unknown',
            totalAmount,
            totalItems
        };
    });
}

// === МАРШРУТЫ API ===

// Главная страница
app.get('/', (req, res) => {
    res.send('Добро пожаловать в API Магазина Кастрюль (Practice 5)!');
});

// --- USERS ---
app.get('/api/users', (req, res) => res.json(users));
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(user);
});

// --- PRODUCTS ---
app.get('/api/products', (req, res) => res.json(products));
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json(product);
});

// --- ORDERS (с Relations и Aggregation) ---

// GET все заказы с агрегацией (JOIN-подобный запрос)
app.get('/api/orders', (req, res) => {
    const ordersWithAggregation = getAllOrdersWithAggregation();
    res.json(ordersWithAggregation);
});

// GET заказ по ID с полными данными (Relations)
app.get('/api/orders/:id', (req, res) => {
    const orderWithRelations = getOrderWithRelations(req.params.id);
    if (!orderWithRelations) {
        return res.status(404).json({ error: 'Заказ не найден' });
    }
    res.json(orderWithRelations);
});

// POST создать новый заказ
app.post('/api/orders', (req, res) => {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'userId и items обязательны' });
    }

    // Валидация товаров
    for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) {
            return res.status(400).json({ error: `Товар ${item.productId} не найден` });
        }
        if (product.quantity < item.quantity) {
            return res.status(400).json({ error: `Недостаточно товара: ${product.name}` });
        }
    }

    const newOrder = {
        id: nanoid(6),
        userId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        items: items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            };
        })
    };

    orders.push(newOrder);
    res.status(201).json(getOrderWithRelations(newOrder.id));
});

// PATCH обновить статус заказа
app.patch('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
    }

    const { status } = req.body;
    if (status && ['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
        order.status = status;
    }

    res.json(getOrderWithRelations(order.id));
});

// DELETE удалить заказ
app.delete('/api/orders/:id', (req, res) => {
    const exists = orders.some(o => o.id === req.params.id);
    if (!exists) {
        return res.status(404).json({ error: 'Заказ не найден' });
    }
    orders = orders.filter(o => o.id !== req.params.id);
    res.status(204).send();
});

// --- AGGREGATION ENDPOINTS ---

// GET статистика по заказам (агрегация)
app.get('/api/stats/orders', (req, res) => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
        return sum + order.items.reduce((s, item) => s + (item.price * item.quantity), 0);
    }, 0);
    const byStatus = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    res.json({
        totalOrders,
        totalRevenue,
        byStatus,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    });
});

// GET заказы пользователя с агрегацией
app.get('/api/users/:id/orders', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const userOrders = getAllOrdersWithAggregation().filter(o => o.userId === req.params.id);
    res.json({ user, orders: userOrders });
});

// 404 для остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});