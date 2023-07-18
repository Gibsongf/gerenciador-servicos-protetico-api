const request = require("supertest");
const app = require("../utils/appTest");
const populateTest = require("../utils/populateDB");
const mongoose = require("mongoose");
const initServer = require("../utils/mongoConfigTest");

let data;

beforeAll(async () => {
    await initServer();
    data = await populateTest(true);
});
describe("/post/ User", () => {
    test("user register successfully", async () => {
        const res = await request(app)
            .post("/user/register")
            .type("form")
            .send({
                nome: "test",
                username: "fake-user",
                password: "123456",
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.message).toEqual("User register completed");
        expect(res.status).toEqual(200);
    });
    test.only("user login successfully", async () => {
        // console.log(data);
        const res = await request(app)
            .post("/user/login")
            .type("form")
            .send({
                username: data.usuario,
                password: data.senha,
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.user.username).toEqual("user123");
        expect(res.status).toEqual(200);
    });
});
