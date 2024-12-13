const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const setupDB = require("./models/setupDB");
const testRoutes = require("./routes/test.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();
setupDB();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/pa/setup/tests", testRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
