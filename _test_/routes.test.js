const request = require("supertest");
const express = require("express");
const apiRoute = require("../routes/api");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRoute);
describe("api routes", () => {
    const allRoutes = [
        {
            name: "Local route",
            url: "test-locais",
            msg: { message: "Test Local" },
        },
        {
            name: "Dentista route",
            url: "test-dentistas",
            msg: { message: "Test Dentista" },
        },
        {
            name: "Paciente route",
            url: "test-pacientes",
            msg: { message: "Test Paciente" },
        },
        {
            name: "Serviço route",
            url: "test-serviços",
            msg: { message: "Test Serviço" },
        },
        {
            name: "Produto route",
            url: "test-produtos",
            msg: { message: "Test Produto" },
        },
    ];
    allRoutes.forEach((route) => {
        test(route.name, (done) => {
            request(app)
                .get("/api/" + route.url)
                .expect("Content-Type", /json/)
                .expect(route.msg)
                .expect(200, done);
        });
    });
});
