// Express Backend Server for MySQL Connection
// Run this with: node backend/server.js

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP MySQL password is empty
  database: 'inventory_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Categories Routes
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.json({ id: result.insertId, name, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suppliers Routes
app.get('/api/suppliers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM suppliers ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const [result] = await pool.query(
      'INSERT INTO suppliers (name, phone, email, address) VALUES (?, ?, ?, ?)',
      [name, phone, email, address]
    );
    res.json({ id: result.insertId, name, phone, email, address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, s.name as supplier_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, sku, category_id, supplier_id, unit, quantity, expiration_date } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (name, sku, category_id, supplier_id, unit, quantity, expiration_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, sku, category_id, supplier_id, unit, quantity, expiration_date]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stock Movements Routes
app.get('/api/stock-movements', async (req, res) => {
  try {
    const { type } = req.query;
    let query = `
      SELECT sm.*, p.name as product_name, p.unit 
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
    `;
    if (type) {
      query += ` WHERE sm.type = '${type}'`;
    }
    query += ' ORDER BY sm.created_at DESC LIMIT 50';
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stock-movements', async (req, res) => {
  try {
    const { product_id, type, quantity, reason, notes } = req.body;
    const [result] = await pool.query(
      'INSERT INTO stock_movements (product_id, type, quantity, reason, notes) VALUES (?, ?, ?, ?, ?)',
      [product_id, type, quantity, reason, notes]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [totalProducts] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [lowStock] = await pool.query('SELECT COUNT(*) as count FROM products WHERE quantity < 10');
    const [totalCategories] = await pool.query('SELECT COUNT(*) as count FROM categories');
    const [recentActivity] = await pool.query('SELECT COUNT(*) as count FROM stock_movements WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
    
    res.json({
      totalProducts: totalProducts[0].count,
      lowStock: lowStock[0].count,
      totalCategories: totalCategories[0].count,
      recentActivity: recentActivity[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/low-stock', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE quantity < 10 ORDER BY quantity ASC LIMIT 10');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/recent-activity', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT sm.*, p.name as product_name 
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      ORDER BY sm.created_at DESC 
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
