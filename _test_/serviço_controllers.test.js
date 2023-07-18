const request = require("supertest");
const app = require("../utils/appTest");

const populateTest = require("../utils/populateDB");
const mongoose = require("mongoose");
const initServer = require("../utils/mongoConfigTest");

const { ObjectId } = require("mongodb");

let data;
let dentistaIdString;
let pacienteIdString;
let produtoIdString;
beforeAll(async () => {
    await initServer();
    data = await populateTest();
    produtoIdString = new ObjectId(data.produto._id).toString();
    dentistaIdString = new ObjectId(data.dentista._id).toString();
    pacienteIdString = new ObjectId(data.paciente._id).toString();
});
describe("/get/ Serviço", () => {
    test("all Serviços", async () => {
        const res = await request(app).get("/api/servico/todos");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        // expect(res.body["todos_serviços"][0].dentista).toEqual(
        //     dentistaIdString
        // );
        expect(res.body["todos_serviços"].length).toBe(1);
        expect(res.status).toEqual(200);
    });
    test("one Serviço details", async () => {
        const res = await request(app).get("/api/servico/" + data.serviço._id);
        const keys = Object.keys(res.body);
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(keys).toContain("dentista");
        expect(keys).toContain("produto");
        expect(keys).toContain("serviço");
        expect(res.status).toEqual(200);
    });
});

describe("/post/ Serviço ", () => {
    test("add a new Serviço to db", async () => {
        const res = await request(app)
            .post("/api/servico/novo")
            .type("form")
            .send({
                dentista: dentistaIdString,
                produto: produtoIdString,
                paciente: pacienteIdString,
            })
            .set("Accept", "application/json");
        // console.log(res);
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.message).toEqual("Serviço Saved");
        expect(res.status).toEqual(200);
    });
});
describe("/put/ Serviço ", () => {
    test("modify a Serviço", async () => {
        const res = await request(app)
            .put("/api/servico/" + data.serviço._id + "/edit")
            .type("form")
            .send({
                dentista: dentistaIdString,
                produto: produtoIdString,
                paciente: pacienteIdString,
                statusEntrega: true,
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.serviço.statusEntrega).toEqual(true);
        expect(res.body.message).toEqual("Serviço Updated");
        expect(res.status).toEqual(200);
    });
});
afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.close();
});
