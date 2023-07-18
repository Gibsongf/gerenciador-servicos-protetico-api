const express = require("express");
const apiRoute = require("../routes/api");
const userRoute = require("../routes/user");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRoute);
app.use("/user", userRoute);
module.exports = app;
