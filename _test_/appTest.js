const express = require("express");
const apiRoute = require("../routes/api");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRoute);
module.exports = app;
