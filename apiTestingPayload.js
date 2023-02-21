const supertest = require("supertest");
const chai = require("chai");

const expect = chai.expect;
const apiUrl = "https://reqres.in"; // replace with your API URL

describe("POST /api/users", () => {
  it("should create a new user with valid data", (done) => {
    const userData = {
      name: "morpheus",
      job: "leader",
    };
    supertest(apiUrl)
      .post("/api/users")
      .send(userData)
      .expect(201)
      .end((err, res) => {
        if (err) {
          console.log(err); // log error in console
          return done(err);
        }
        console.log(res.body); // log response in console
        // assertions for successful response
        expect(res.body).to.have.property("id");
        expect(res.body.name).to.equal(userData.name);
        expect(res.body.job).to.equal(userData.job);
        done();
      });
  });
});
