const request = require("supertest");
const app = require("../utils/appTest");

const populateTest = require("../utils/populateDB");
const mongoose = require("mongoose");
const initServer = require("../utils/mongoConfigTest");

let data;

beforeAll(async () => {
    await initServer();
    data = await populateTest();
    // console.log(data);
});
describe("/get/ local", () => {
    test("all Local", async () => {
        const res = await request(app).get("/api/local/todos");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body["todos_locais"].length).toBe(1);
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
    test("modify a Local", async () => {
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

describe("/delete/ Local", () => {
    test("Cant delete Local if has associated Dentista in the db", async () => {
        const res = await request(app)
            .delete("/api/local/" + data.local._id)
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
