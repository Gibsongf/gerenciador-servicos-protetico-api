const request = require("supertest");
const app = require("../utils/appTest");

const populateTest = require("../utils/populateDBTest");
const mongoose = require("mongoose");
const initServer = require("../utils/mongoConfigTest");
const { ObjectId } = require("mongodb");
const { faker } = require("@faker-js/faker");
let data;

beforeAll(async () => {
    // init a test mongoDB test
    await initServer();
    data = await populateTest();
});
describe("/get/ cliente", () => {
    test("all cliente", async () => {
        const res = await request(app).get("/api/cliente/todos");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body["all"][0].cpf).toEqual(data.cliente.cpf);
        expect(res.body["all"].length).toBe(1);
        expect(res.status).toEqual(200);
    });
    test("one cliente details", async () => {
        const res = await request(app).get("/api/cliente/" + data.cliente._id);
        const keys = Object.keys(res.body);
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(keys).toContain("serviços");
        expect(keys).toContain("cliente");
        expect(res.status).toEqual(200);
    });
});

describe("/post/ cliente ", () => {
    test("add a new cliente to db", async () => {
        const objectIdString = new ObjectId(data.local._id).toString();
        const res = await request(app)
            .post("/api/cliente/novo")
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
        expect(res.body.message).toEqual("cliente saved");
        expect(res.status).toEqual(200);
    });
});
describe("/put/ cliente ", () => {
    test("modify a cliente", async () => {
        const { local, telefone, cpf } = data.cliente;
        const objectIdString = new ObjectId(local._id).toString();

        const res = await request(app)
            .put("/api/cliente/" + data.cliente._id + "/edit")
            .type("form")
            .send({
                nome: "Novo Nome",
                sobrenome: "Updated",
                local: objectIdString,
                telefone,
                cpf,
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.cliente.sobrenome).toEqual("Updated");
        expect(res.status).toEqual(200);
    });
});
describe("/delete/ cliente", () => {
    test("Cant delete cliente if has associated Serviço in the db", async () => {
        const res = await request(app)
            .delete("/api/cliente/" + data.cliente._id)
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.status).toEqual(409);
    });
});
afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.close();
});
