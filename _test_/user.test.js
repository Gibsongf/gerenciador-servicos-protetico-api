const request = require("supertest");
const app = require("../utils/appTest");
const populateTest = require("../utils/populateDB");
const mongoose = require("mongoose");
const initServer = require("../utils/mongoConfigTest");

let data;
const login = {
    nome: "test",
    username: "fake-user",
    password: "123456",
};
beforeAll(async () => {
    await initServer();
    data = await populateTest(true);
});
describe("/post/ User", () => {
    test("user register successfully", async () => {
        const res = await request(app)
            .post("/user/register")
            .type("form")
            .send(login)
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.message).toEqual("User register completed");
        expect(res.status).toEqual(200);
    });
    test("user login successfully", async () => {
        const res = await request(app)
            .post("/user/login")
            .type("form")
            .send({
                username: login.username,
                password: login.password,
            })
            .set("Accept", "application/json");
        expect(res.headers["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(res.body.user.username).toEqual(login.username);
        expect(res.status).toEqual(200);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
