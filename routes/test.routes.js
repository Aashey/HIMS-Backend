const express = require("express");
const router = express.Router();
const testController = require("../controllers/test.controller");

router.post("/", testController.createTest);
router.get("/", testController.getTests);
router.put("/:id", testController.updateTest);
router.delete("/:id", testController.deleteTests);

module.exports = router;
