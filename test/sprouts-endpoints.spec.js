const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe.only("Sprouts Endpoints", function () {
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
    db.raw("TRUNCATE TABLE sprouts RESTART IDENTITY CASCADE;")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE sprouts RESTART IDENTITY CASCADE;")
  );

  describe(`GET /api/sprouts`, () => {
    context("Given there are sprouts in the database", () => {
      const testSprouts = [
        {
          id: 1,
          name: "Elizabeth",
          age: "10/10/2019",
          image: "",
          useremail: "daniellerussell714@gmail.com",
        },
        {
          id: 2,
          name: "Benjamin",
          age: "10/10/2019",
          image: "",
          useremail: "daniellerussell714@gmail.com",
        },
        {
          id: 3,
          name: "Olivia",
          age: "10/10/2019",
          image: "",
          useremail: "daniellerussell714@gmail.com",
        },
        {
          id: 4,
          name: "Olivia",
          age: "10/10/2019",
          useremail: "indyshadow@gmail.com",
          image: "",
        },
      ];

      beforeEach("insert sprouts", () => {
        return db.into("sprouts").insert(testSprouts);
      });
      it("GET /api/sprouts responds with 200 and all of the sprouts", () => {
        return supertest(app).get("/api/sprouts").expect(200, testSprouts);
      });

      it("GET /api/sprouts/:useremail responds with 200 and the specified sprouts", () => {
        return supertest(app)
          .get("/api/sprouts/indyshadow@gmail.com")
          .expect(200, {
            0: {
              id: 4,
              name: "Olivia",
              age: "10/10/2019",
              useremail: "indyshadow@gmail.com",
              image: "",
            },
            useremail: "",
            name: "",
            age: "",
            image: "",
          });
      });
    });
});
describe(`POST /api/sprouts`, () => {
  it(`creates a sprout, responding with 201 and the new sprout`, () => {
    const newSprout = {
      id: 1,
      name: "Benjamin",
      age: "10/10/2019",
      image: "",
      useremail: "daniellerussell714@gmail.com",
    };
    return supertest(app)
      .post("/api/sprouts")
      .send(newSprout)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).to.eql(newSprout.name);
        expect(res.body.age).to.eql(newSprout.age);
        expect(res.body.useremail).to.eql(newSprout.useremail);
        expect(res.body).to.have.property("id");
        expect(res.headers.location).to.eql(`/api/sprouts/1`);
      })
      .then((res) =>
        supertest(app).get(`/api/sprouts/1`).expect(res.body)
      );
  });
});
});




