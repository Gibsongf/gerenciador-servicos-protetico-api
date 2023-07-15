const request = require("supertest");
const express = require("express");
const apiRoute = require("../routes/api");
const app = require("./appTest");

const populateTest = require("../populateDB");
const mongoose = require("mongoose");
const initServer = require("./mongoConfigTest");

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRoute);
let data;

beforeAll(async () => {
    await initServer();
    data = await populateTest();
});
describe("/get/ local", () => {
    test("all Local", async () => {
        const res = await request(app).get("/api/todos-locais");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body["todos_locais"].length).toBe(2);
        expect(res.status).toEqual(200);
    });
    test("one local details", async () => {
        const res = await request(app).get("/api/local/" + data.local._id);
        const keys = Object.keys(res.body);
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(keys).toContain("local");
        expect(keys).toContain("dentistas");
        expect(res.status).toEqual(200);
    });
});

describe("/post/ Local ", () => {
    test("add a new Local to db", async () => {
        const res = await request(app)
            .post("/api/local/novo")
            .type("form")
            .send({
                nome: "Fake LOCAL",
                endereço: "avenida Alves Dias",
                telefone: "4002-8922",
                cep: "11111-111",
                tipo_tabela: "Reduzido",
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.message).toEqual("Local saved");
        expect(res.status).toEqual(200);
    });
});
describe("/put/ Local ", () => {
    test.only("modify a Local", async () => {
        const res = await request(app)
            .put("/api/local/" + data.local._id + "/edit")
            .type("form")
            .send({
                nome: "Fake Name",
                endereço: "Updated",
                telefone: "4002-8922",
                cep: "11111-111",
                tipo_tabela: "Normal",
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.message).toEqual("Local updated");
        expect(res.body.local.endereço).toEqual("Updated");
        expect(res.body.local.tipo_tabela).toEqual("Normal");
        expect(res.status).toEqual(200);
    });
});
afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.close();
});
