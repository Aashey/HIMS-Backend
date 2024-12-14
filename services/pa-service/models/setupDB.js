const sqlite3 = require("sqlite3").verbose();
function setupDB() {
  const db = new sqlite3.Database("./db/pa.db", (err) => {
    if (err) console.log(`Error connecting to the database.`, err.message);
    else console.log(`Connected to the database.`);
  });
  // Test Names Table
  db.run(`
         CREATE TABLE IF NOT EXISTS test_names (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL UNIQUE,
         code TEXT NOT NULL UNIQUE,
         price REAL NOT NULL
         ) 
          `);

  // Patient Types Table
  db.run(`
          CREATE TABLE IF NOT EXISTS patient_types (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          code TEXT NOT NULL UNIQUE
          )
          `);

  // Scheme Table
  db.run(`
          CREATE TABLE IF NOT EXISTS discount_schemes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          code TEXT NOT NULL UNIQUE,
          discount_percentage REAL NOT NULL
          )
          `);

  // Patient Table
  db.run(`
          CREATE TABLE IF NOT EXISTS patients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          middle_name TEXT,
          last_name TEXT NOT NULL,
          contact_number TEXT,
          patient_type_id INTEGER,
          FOREIGN KEY(patient_type_id) REFERENCES patient_types(id)
          )
          `);

  // Bill Master Table

  db.run(`
          CREATE TABLE IF NOT EXISTS bill_master (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id INTEGER NOT NULL,
          total_amount REAL NOT NULL,
          discount_applied REAL,
          final_amount REAL NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(patient_id) REFERENCES patients(id)
          )
          `);

  // Bill Details Table

  db.run(`
          CREATE TABLE IF NOT EXISTS bill_details (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bill_id INTEGER,
          test_name TEXT NOT NULL,
          test_price REAL NOT NULL,
          FOREIGN KEY(bill_id) REFERENCES bill_master(id)
          )
          `);

  db.close();
}

module.exports = setupDB;
