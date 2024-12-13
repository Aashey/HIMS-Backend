const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/hims.db", (err) => {
  if (err) console.log("Failed to connect to the database!");
});

module.exports = db;
