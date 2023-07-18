const request = require("supertest");
const app = require("../utils/appTest");

const populateTest = require("../utils/populateDB");
const mongoose = require("mongoose");
const initServer = require("../utils/mongoConfigTest");

const { ObjectId } = require("mongodb");
let data;

beforeAll(async () => {
    await initServer();
    data = await populateTest();
});
describe("/get/ Paciente", () => {
    test("all Pacientes", async () => {
        const res = await request(app).get("/api/paciente/todos");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );

        expect(res.body["todos_pacientes"][0].nome).toEqual(data.paciente.nome);
        expect(res.body["todos_pacientes"].length).toBe(1);
        expect(res.status).toEqual(200);
    });
    test("one Paciente details", async () => {
        const res = await request(app).get(
            "/api/paciente/" + data.paciente._id
        );
        const keys = Object.keys(res.body);
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(keys).toContain("dentista");
        expect(keys).toContain("produto");
        expect(keys).toContain("paciente");
        expect(res.status).toEqual(200);
    });
});

describe("/post/ Paciente ", () => {
    test("add a new Paciente to db", async () => {
        const dentistaIdString = new ObjectId(data.dentista._id).toString();
        const produtoIdString = new ObjectId(data.produto._id).toString();
        const res = await request(app)
            .post("/api/paciente/novo")
            .type("form")
            .send({
                nome: "Fake paciente",
                dentista: dentistaIdString,
                produto: produtoIdString,
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.paciente.nome).toEqual("Fake paciente");
        expect(res.status).toEqual(200);
    });
});
describe("/put/ Paciente ", () => {
    test("modify a Paciente", async () => {
        const dentistaIdString = new ObjectId(data.dentista._id).toString();
        const produtoIdString = new ObjectId(data.produto._id).toString();

        const res = await request(app)
            .put("/api/paciente/" + data.paciente._id + "/edit")
            .type("form")
            .send({
                nome: "Nome Updated",
                dentista: dentistaIdString,
                produto: produtoIdString,
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.paciente.nome).toEqual("Nome Updated");
        expect(res.body.message).toEqual("Paciente updated");
        expect(res.status).toEqual(200);
    });
});
afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.close();
});
