import sqlite3 from 'sqlite3';

// Use verbose mode for better error messages
sqlite3.verbose();

/**
 * Initialize the SQLite database
 * Creates the todos table if it doesn't exist
 * @returns {Promise<sqlite3.Database>} Database connection
 */
export function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('todos.db', (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create the todos table if it doesn't exist
      const sql = `
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          completed BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('Database initialized and table created');
        resolve(db);
      });
    });
  });
}
