const express = require("express");
const apiRoute = require("../routes/api");
require("./mongoConfigTest");
const app = express();
// initializeMongoServer();

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRoute);

module.exports = app;
