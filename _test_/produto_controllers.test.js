const request = require("supertest");
const express = require("express");
const apiRoute = require("../routes/api");
const app = require("./appTest");

const populateTest = require("../populateDB");
const mongoose = require("mongoose");
const initServer = require("./mongoConfigTest");

const { faker } = require("@faker-js/faker");
app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRoute);
let data;

beforeAll(async () => {
    await initServer();
    data = await populateTest();
});
describe("/get/ Produto", () => {
    test("all Produtos", async () => {
        const res = await request(app).get("/api/produto/todos");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );

        expect(res.body["todos_produtos"][0].nome).toEqual(data.produto.nome);
        expect(res.body["todos_produtos"].length).toBe(1);
        expect(res.status).toEqual(200);
    });
    test("one Produto details", async () => {
        const res = await request(app).get("/api/produto/" + data.produto._id);
        const keys = Object.keys(res.body);
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(keys).toContain("serviço");
        expect(keys).toContain("produto");
        expect(res.status).toEqual(200);
    });
});

describe("/post/ Produto ", () => {
    test("add a new Produto to db", async () => {
        const res = await request(app)
            .post("/api/produto/novo")
            .type("form")
            .send({
                nome: "Fake Produto",
                "valor normal": faker.commerce.price({ min: 100, max: 200 }),
                "valor reduzido": faker.commerce.price({ max: 100 }),
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.message).toEqual("Produto saved");
        expect(res.body.produto.nome).toEqual("Fake Produto");
        expect(res.status).toEqual(200);
    });
});
describe("/put/ Produto ", () => {
    test("modify a Produto", async () => {
        const res = await request(app)
            .put("/api/produto/" + data.produto._id + "/edit")
            .type("form")
            .send({
                nome: "Nome Updated",
                "valor normal": 1000,
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.produto.nome).toEqual("Nome Updated");
        expect(res.body.produto.valor_normal).toEqual(1000);
        expect(res.status).toEqual(200);
    });
});
afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.close();
});
