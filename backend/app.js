const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');  // ← Добавили

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// CORS middleware  ← Добавили
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware для логирования запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}][${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// База данных товаров (кастрюли)
let products = [
    { id: nanoid(6), name: 'Кастрюля "Шеф-Повар" 20л', category: 'Кастрюли', price: 5990, quantity: 15, description: 'Нержавеющая сталь, тройное дно' },
    { id: nanoid(6), name: 'Кастрюля эмалированная 5л', category: 'Кастрюли', price: 1200, quantity: 30, description: 'Классическая эмалированная кастрюля' },
    { id: nanoid(6), name: 'Казан чугунный 12л', category: 'Казаны', price: 3500, quantity: 8, description: 'Настоящий чугун для плова' },
];

// ============================================
// SWAGGER CONFIGURATION
// ============================================

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID товара
 *           example: "abc123"
 *         name:
 *           type: string
 *           description: Название товара (кастрюли)
 *           example: "Кастрюля 20л"
 *         category:
 *           type: string
 *           description: Категория товара
 *           example: "Кастрюли"
 *         price:
 *           type: integer
 *           description: Цена в рублях
 *           example: 5990
 *         quantity:
 *           type: integer
 *           description: Количество на складе
 *           example: 15
 *         description:
 *           type: string
 *           description: Описание товара
 *           example: "Нержавеющая сталь"
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар (кастрюлю)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в теле запроса
 */
app.post("/api/products", (req, res) => {
    const { name, category, price, quantity, description } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ error: "Name and price are required" });
    }

    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category || 'Другое',
        price: Number(price),
        quantity: Number(quantity) || 0,
        description: description || ''
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get("/api/products", (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Товар не найден
 */
app.patch("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    if (req.body?.name === undefined && req.body?.price === undefined && req.body?.quantity === undefined) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    const { name, category, price, quantity, description } = req.body;
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (quantity !== undefined) product.quantity = Number(quantity);
    if (description !== undefined) product.description = description;

    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const exists = products.some(p => p.id === id);
    
    if (!exists) {
        return res.status(404).json({ error: "Product not found" });
    }
    
    products = products.filter(p => p.id !== id);
    res.status(204).send();
});

// ============================================
// SWAGGER SETUP
// ============================================

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Магазина Кастрюль',
            version: '1.0.0',
            description: 'Документация API для управления товарами магазина кастрюль',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI по адресу /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger UI доступен по адресу http://localhost:${port}/api-docs`);
});