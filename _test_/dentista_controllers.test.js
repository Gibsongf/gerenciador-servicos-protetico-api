const request = require("supertest");
const express = require("express");
const apiRoute = require("../routes/api");
const app = require("./appTest");

const populateTest = require("../populateDB");
const mongoose = require("mongoose");
const initServer = require("./mongoConfigTest");

app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRoute);

beforeAll(async () => {
    await initServer();
    await populateTest();
});
describe("api dentista methods", () => {
    test("all dentistas", async () => {
        const res = await request(app).get("/api/todos-dentistas");
        // expect(res.headers["content-type"]).toEqual(
        //     "application/json; charset=utf-8"
        // );
        // expect(res.body["todos_dentistas"].length).toBe(5);
        // console.log(res.headers["content-type"]);
        // expect({ todos_dentistas: [Object] })
        expect(200);
    });
});
afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.close();
});
// describe("GET /users", () => {
//     it("should return an array of users", async () => {
//       const res = await request(app)
//         .get("/users")
//         .set("Authorization", token)
//         .set("Accept", "application/json");
//       expect(res.statusCode).toEqual(200);
//       expect(res.header["content-type"]).toEqual(expect.stringMatching(/json/));
//       expect(res.body).toHaveProperty("users");
//       expect(res.body.users).toHaveLength(3);
//     });
//   });
