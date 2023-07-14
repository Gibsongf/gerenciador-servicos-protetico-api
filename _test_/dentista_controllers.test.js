const request = require("supertest");
const express = require("express");
const apiRoute = require("../routes/api");
const app = require("./appTest");

const populateTest = require("../populateDB");
const mongoose = require("mongoose");
const initServer = require("./mongoConfigTest");

const { ObjectId } = require("mongodb");
const { faker } = require("@faker-js/faker");
app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRoute);
let data;
beforeAll(async () => {
    await initServer();
    data = await populateTest();
    // console.log(data);
});
describe("/get/ dentista", () => {
    test("all dentistas", async () => {
        const res = await request(app).get("/api/todos-dentistas");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body["todos_dentistas"][0].cpf).toEqual(data.dentista.cpf);
        expect(res.body["todos_dentistas"].length).toBe(2);
        expect(res.status).toEqual(200);
    });
    test("one dentistas details", async () => {
        const res = await request(app).get(
            "/api/dentista/" + data.dentista._id
        );
        const keys = Object.keys(res.body);
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(keys).toContain("serviços");
        expect(keys).toContain("dentista");
        expect(res.status).toEqual(200);
    });
});

describe("/post/ Dentista ", () => {
    test.only("add a new Dentista to db", async () => {
        const objectIdString = new ObjectId(data.local._id).toString();
        const res = await request(app)
            .post("/api/dentista/novo")
            .type("form")
            .send({
                nome: "Fake",
                local: objectIdString,
                telefone: "4002-8922",
                cpf: String(faker.phone.number("###########")),
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.message).toEqual("Dentista saved");
        expect(res.status).toEqual(200);
    });
});
afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.close();
});
