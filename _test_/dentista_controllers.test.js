const request = require("supertest");
const express = require("express");
const apiRoute = require("../routes/api");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRoute);
describe("api dentista methods", () => {
    test("");
});
