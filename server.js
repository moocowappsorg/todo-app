import express from 'express';
import cors from 'cors';
import { initDatabase } from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
let db;

// Initialize database and start server
initDatabase()
  .then((database) => {
    db = database;
    console.log('Database connected successfully');

    // API Routes

    // GET all todos
    app.get('/api/todos', (req, res) => {
      db.all('SELECT * FROM todos ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
          console.error('Error fetching todos:', err);
          res.status(500).json({ error: 'Failed to fetch todos' });
          return;
        }
        res.json(rows);
      });
    });

    // POST create a new todo
    app.post('/api/todos', (req, res) => {
      const { title } = req.body;

      if (!title || title.trim() === '') {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      db.run(
        'INSERT INTO todos (title) VALUES (?)',
        [title.trim()],
        function (err) {
          if (err) {
            console.error('Error creating todo:', err);
            res.status(500).json({ error: 'Failed to create todo' });
            return;
          }

          // Fetch the created todo
          db.get('SELECT * FROM todos WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              console.error('Error fetching created todo:', err);
              res.status(500).json({ error: 'Failed to fetch created todo' });
              return;
            }
            res.status(201).json(row);
          });
        }
      );
    });

    // PUT update a todo (toggle completion)
    app.put('/api/todos/:id', (req, res) => {
      const { id } = req.params;
      const { completed } = req.body;

      if (typeof completed !== 'boolean') {
        res.status(400).json({ error: 'Completed must be a boolean' });
        return;
      }

      db.run(
        'UPDATE todos SET completed = ? WHERE id = ?',
        [completed, id],
        function (err) {
          if (err) {
            console.error('Error updating todo:', err);
            res.status(500).json({ error: 'Failed to update todo' });
            return;
          }

          if (this.changes === 0) {
            res.status(404).json({ error: 'Todo not found' });
            return;
          }

          // Fetch the updated todo
          db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
            if (err) {
              console.error('Error fetching updated todo:', err);
              res.status(500).json({ error: 'Failed to fetch updated todo' });
              return;
            }
            res.json(row);
          });
        }
      );
    });

    // DELETE a todo
    app.delete('/api/todos/:id', (req, res) => {
      const { id } = req.params;

      db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
        if (err) {
          console.error('Error deleting todo:', err);
          res.status(500).json({ error: 'Failed to delete todo' });
          return;
        }

        if (this.changes === 0) {
          res.status(404).json({ error: 'Todo not found' });
          return;
        }

        res.json({ message: 'Todo deleted successfully' });
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
