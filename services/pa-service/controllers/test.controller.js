const db = require("../models/db");

// helper function to handle db error
const handleDbError = (res, err, message) => {
  console.log("Error:", err);
  return res.status(500).json({ message, error: err.message });
};

// helper function to validate request data
const validateTestData = (data) => {
  const { name, code, price } = data;
  if (!name) return "Test name is required.";
  if (!code) return "Test code is required.";
  if (!price) return "Test price is required.";
  return null;
};

// helper function to check test exists in db
const checkTestExists = (name, code, id, callback, mode) => {
  if (mode === "create") {
    const checkQuery = "SELECT * from test_names where name = ? OR code = ?";
    db.get(checkQuery, [name, code], callback);
  } else if (mode === "update") {
    const checkQuery =
      "SELECT * from test_names where (name = ? OR code = ?) AND id!= ?";
    db.get(checkQuery, [name, code, id], callback);
  }
};

// helper function to send response when test exists
const testExistsResponse = (res, row, name, code) => {
  if (row.name === name)
    return res.status(400).json({ message: "Test name is alrady taken !" });
  else if (row.code === code)
    return res.status(400).json({ message: "Test code is alrady taken !" });
};

// Create a test
const createTest = (req, res) => {
  const { name, code, price } = req.body;

  const validationError = validateTestData(req.body);
  if (validationError)
    return res.status(400).json({ message: validationError });

  checkTestExists(
    name,
    code,
    null,
    (err, row) => {
      if (err) handleDbError(res, err, "Error checking test !");
      if (row) {
        return testExistsResponse(res, row, name, code);
      }

      const query = `INSERT INTO test_names (name,code,price) values(?,?,?)`;

      db.run(query, [name, code, price], function (err) {
        if (err) handleDbError(res, err, "Error adding test !");
        else
          return res.status(201).json({
            message: "Test created successfully !",
            data: { id: this.lastID, name, code, price },
          });
      });
    },
    "create"
  );
};

// Get all tests
const getTests = (req, res) => {
  const query = `SELECT * FROM test_names`;

  db.all(query, [], (err, rows) => {
    if (err) handleDbError(res, err, "Error fetching tests !");
    return res
      .status(200)
      .json({ message: "Tests fetched successfully !", data: rows || [] });
  });
};

// Get a single test
const getTest = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Test id is required !" });
  const query = `SELECT * FROM test_names where id = ?`;

  db.get(query, [id], (err, row) => {
    if (err) handleDbError(res, err, "Error fetching tests !");
    return res
      .status(200)
      .json({ message: "Test fetched successfully !", data: row || [] });
  });
};

// Update a test
const updateTest = (req, res) => {
  const { id } = req.params;
  const { name, code, price } = req.body;

  const validationError = validateTestData(req.body);
  if (validationError)
    return res.status(400).json({ message: validationError });

  checkTestExists(
    name,
    code,
    id,
    function (err, row) {
      if (err) handleDbError(res, err, "Error checking test !");
      if (row) {
        return testExistsResponse(res, row, name, code);
      }

      const query = `UPDATE test_names SET name =?,code=?,price=? where id = ?`;

      db.run(query, [name, code, price, id], function (err) {
        if (err) handleDbError(res, err, "Error updating test !");
        if (this.changes === 0)
          return res.status(404).json({ message: "Test not found !" });

        return res.status(201).json({
          message: "Test updated successfully !",
          data: {
            id,
            name,
            code,
            price,
          },
        });
      });
    },
    "update"
  );
};

// Delete a test
const deleteTest = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM test_names where id = ?`;
  db.run(query, [id], function (err) {
    if (err) handleDbError(res, err, "Error deleting the test !");
    if (this.changes === 0)
      return res.status(404).json({ message: "Test not found !" });

    return res.status(200).json({ message: "Test deleted successfully !" });
  });
};

module.exports = { createTest, getTests, getTest, updateTest, deleteTest };
