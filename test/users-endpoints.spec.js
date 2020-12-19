const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const bcrypt = require("bcryptjs");
const supertest = require("supertest");

describe.only("Auth Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () =>
    db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE;")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE;")
  );

  describe(`POST /api/users`, () => {
    it(`creates a user, responding with 201 and the new user`, () => {
      const newUser = {
        firstname: "Danielle",
        lastname: "Russell",
        email: "daniellerussell714@gmail.com",
        password: "12345678",
      };

      return supertest(app)
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.firstname).to.eql(newUser.firstname);
          expect(res.body.lastname).to.eql(newUser.lastname);
          expect(res.body.email).to.eql(newUser.email);
          expect(res.body).to.have.property("id");
        })
        .then((res) =>
          supertest(app)
            .get(`/api/users/`)
            .expect([
              {
                id: 1,
                firstname: "Danielle",
                lastname: "Russell",
                email: "daniellerussell714@gmail.com",
              },
            ])
        );
    });
  });

  describe("POST api/users/login", () => {
    it(`Generates an API token, responding with 200 and the new user as well as the API token`, () => {
      const newUser = {
        firstname: "Danielle",
        lastname: "Russell",
        email: "daniellerussell714@gmail.com",
        password: "12345678",
      };

      const login = {
        email: "daniellerussell714@gmail.com",
        password: "12345678",
      };

      return supertest(app)
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.firstname).to.eql(newUser.firstname);
          expect(res.body.lastname).to.eql(newUser.lastname);
          expect(res.body.email).to.eql(newUser.email);
          expect(res.body).to.have.property("id");
        })
        .then((res) =>
          supertest(app)
            .get(`/api/users/`)
            .expect([
              {
                id: 1,
                firstname: "Danielle",
                lastname: "Russell",
                email: "daniellerussell714@gmail.com",
              },
            ])
        )
        .then((res) =>
          supertest(app)
            .post("/api/users/login")
            .send(login)
            .expect(200)
            .expect((res) => {
              expect(res.body).to.have.property("authToken");
            })
        );
    });
  });
});
