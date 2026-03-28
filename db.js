const path = require('path');
const { LowSync } = require('lowdb'); // Use the Sync version for easier cloud deployment
const { JSONFileSync } = require('lowdb/node');

// This ensures Render finds the file in the correct folder
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFileSync(file);

// 1. Initialize with default data immediately
const db = new LowSync(adapter, { users: [], messages: [], rooms: [] });

// 2. Read existing data right away
db.read();

// 3. Ensure structure exists
db.data = db.data || { users: [], messages: [], rooms: [] };
db.write();

function initDB() {
  // Keeping this function so your index.js doesn't break, 
  // but the work is already done above!
  console.log("Empty initDB called - DB already initialized.");
  return Promise.resolve();
}

module.exports = { db, initDB };