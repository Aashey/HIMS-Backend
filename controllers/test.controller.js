const db = require("../models/db");

// Create Test
const createTest = (req, res) => {
  const { name, code, price } = req.body;

  if (!name) return res.status(400).json({ message: "Test name is required." });
  else if (!code)
    return res.status(400).json({ message: "Test code is required." });
  else if (!price)
    return res.status(400).json({ message: "Test price is required." });

  const checkQuery = "SELECT * from test_names where name = ? OR code = ?";

  db.get(checkQuery, [name, code], function (err, row) {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      if (row.name === name)
        return res.status(400).json({
          message: "Test name is already taken !",
          name: row.name,
        });
      else if (row.code === code)
        return res.status(400).json({
          message: "Test code is already taken !",
          code: row.code,
        });
    }

    const query = `INSERT INTO test_names (name,code,price) values(?,?,?)`;

    db.run(query, [name, code, price], function (err) {
      if (err)
        return res
          .status(500)
          .json({ message: "Error adding test !", error: err.message });
      else
        return res.status(201).json({
          message: "Test created successfully !",
          id: this.lastID,
          name,
          code,
          price,
        });
    });
  });
};

// Get Tests
const getTests = (req, res) => {
  const query = `SELECT * FROM test_names`;

  db.all(query, [], function (err, rows) {
    if (err)
      return res
        .status(500)
        .json({ message: "Error fetching tests !", error: err.message });
    if (rows.length === 0)
      return res
        .status(200)
        .json({ message: "Tests fetched successfully !", data: [] });
    else
      return res
        .status(200)
        .json({ message: "Tests fetched successfully !", data: [rows] });
  });
};

// Update Test
const updateTest = (req, res) => {
  const { id } = req.params;
  const { name, code, price } = req.body;

  if (!id) return res.status(400).json({ message: "Id is required." });
  else if (!name)
    return res.status(400).json({ message: "Test name is required." });
  else if (!code)
    return res.status(400).json({ message: "Test code is required." });
  else if (!price)
    return res.status(400).json({ message: "Test price is required." });

  const checkQuery =
    "SELECT * from test_names where (name = ? OR code = ?) AND id!= ?";

  db.get(checkQuery, [name, code, id], function (err, row) {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      if (row.name === name)
        return res.status(400).json({
          message: "Test name is already taken !",
          name: row.name,
        });
      else if (row.code === code)
        return res.status(400).json({
          message: "Test code is already taken !",
          code: row.code,
        });
    }

    const query = `UPDATE test_names SET name =?,code=?,price=? where id = ?`;

    db.run(query, [name, code, price, id], function (err) {
      if (err)
        return res
          .status(500)
          .json({ message: "Error updating test !", error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ message: "Test not found !" });

      return res.status(201).json({
        message: "Test updated successfully !",
        id,
        name,
        code,
        price,
      });
    });
  });
};

// Delete Tests
const deleteTests = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM test_names where id = ?`;
  db.run(query, [id], function (err) {
    if (err)
      return res
        .status(500)
        .json({ message: "Error deleting the test !", error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Test not found !" });
    res.status(200).json({ message: "Test deleted successfully !" });
  });
};

module.exports = { createTest, getTests, updateTest, deleteTests };
