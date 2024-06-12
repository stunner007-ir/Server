const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
require('dotenv').config();
const config = require("./config");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", routes);

mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

module.exports = app;
