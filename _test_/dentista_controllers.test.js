const request = require("supertest");
const app = require("../utils/appTest");

const populateTest = require("../utils/populateDB");
const mongoose = require("mongoose");
const initServer = require("../utils/mongoConfigTest");
const { ObjectId } = require("mongodb");
const { faker } = require("@faker-js/faker");
let data;

beforeAll(async () => {
    await initServer();
    data = await populateTest();
});
describe("/get/ dentista", () => {
    test("all dentistas", async () => {
        const res = await request(app).get("/api/dentista/todos");
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
    test("add a new Dentista to db", async () => {
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
describe("/put/ Dentista ", () => {
    test("modify a Dentista", async () => {
        const { local, telefone, cpf } = data.dentista;
        const objectIdString = new ObjectId(local._id).toString();

        const res = await request(app)
            .put("/api/dentista/" + data.dentista._id + "/edit")
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
        expect(res.body.dentista.sobrenome).toEqual("Updated");
        expect(res.status).toEqual(200);
    });
});
afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.close();
});
