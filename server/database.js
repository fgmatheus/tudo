/* const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'customerUUIDMap.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        email TEXT PRIMARY KEY,
        uuid TEXT NOT NULL,
        password TEXT NOT NULL,
        product_id TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });
  }
});

module.exports = db; */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'customerUUIDMap.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        email TEXT NOT NULL,
        uuid TEXT NOT NULL,
        password TEXT NOT NULL,
        product_id TEXT NOT NULL,
        PRIMARY KEY (email, product_id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });
  }
});

module.exports = db;