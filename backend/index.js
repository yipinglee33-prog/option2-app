require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, initDatabase } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend 🚀' });
});

app.get('/api/db-test', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'DATABASE_URL is not set' });
  }

  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ now: result.rows[0].now });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/api/notes', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'DATABASE_URL is not set' });
  }

  try {
    const result = await pool.query(
      'SELECT id, text, created_at FROM notes ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'DATABASE_URL is not set' });
  }

  const text = req.body?.text?.trim();

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notes (text) VALUES ($1) RETURNING id, text, created_at',
      [text]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await initDatabase();
  } catch (error) {
    console.error('Database initialization failed:', error);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
