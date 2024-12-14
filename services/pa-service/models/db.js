const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/pa.db", (err) => {
  if (err) console.log(`Error connecting to the database.`, err.message);
});

module.exports = db;
