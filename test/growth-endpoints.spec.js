const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe.only("Growth Endpoints", function () {
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
    db.raw("TRUNCATE TABLE growth, sprouts RESTART IDENTITY CASCADE;")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE growth, sprouts RESTART IDENTITY CASCADE;")
  );

  describe("GET api/growth/", () => {
    context("Given there are growth records in the database", () => {
      const testGrowth = [
        {
          id: 1,
          sproutid: "2",
          title: "First growth test!",
          date: "11-23-2020",
          number: "1",
          units: "lbs",
          useremail: "daniellerussell714@gmail.com",
        },
        {
          id: 2,
          sproutid: "3",
          title: "Second growth test!",
          date: "11-23-2020",
          number: "1",
          units: "lbs",
          useremail: "indyshadow@gmail.com",
        },
      ];

      const testSprouts = [
        {
          id: 2,
          name: "Christian",
          age: "10/10/2019",
          image: "",
          useremail: "daniellerussell714@gmail.com",
        },
        {
          id: 3,
          name: "Christian",
          age: "10/10/2019",
          image: "",
          useremail: "daniellerussell714@gmail.com",
        },
      ];

      beforeEach("insert sprout", () => {
        return db.into("sprouts").insert(testSprouts);
      });

      beforeEach("insert growth", () => {
        return db.into("growth").insert(testGrowth);
      });

      it("GET /api/growth responds with 200 and all of the growth records", () => {
        return supertest(app).get("/api/growth").expect(200, testGrowth);
      });
      it("GET /api/growth/:useremail responds with 200 and the specified growth records", () => {
        return supertest(app)
          .get("/api/growth/indyshadow@gmail.com")
          .expect(200, {
            0: {
              id: 2,
              sproutid: 3,
              title: "Second growth test!",
              date: "11-23-2020",
              number: 1,
              units: "lbs",
              useremail: "indyshadow@gmail.com",
            },
            useremail: "",
            title: "",
            date: "",
            sproutid: "",
            number: "",
            units: "",
          });
      });
    });
  });

  describe(`POST /api/growth`, () => {
    const testSprout = {
      id: 2,
      name: "Christian",
      age: "10/10/2019",
      image: "",
      useremail: "daniellerussell714@gmail.com",
    };

    beforeEach("insert sprout", () => {
      return db.into("sprouts").insert(testSprout);
    });

    it(`creates a growth record, responding with 201 and the new record`, () => {
      const testGrowth = {
        id: 1,
        sproutid: 2,
        title: "First growth test!",
        date: "11-23-2020",
        number: "1",
        units: "lbs",
        useremail: "daniellerussell714@gmail.com",
      };

      return supertest(app)
        .post("/api/growth")
        .send(testGrowth)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(testGrowth.title);
          expect(res.body.date).to.eql(testGrowth.date);
          expect(res.body.useremail).to.eql(testGrowth.useremail);
          expect(res.body.units).to.eql(testGrowth.units);
          expect(res.body.number).to.eql(testGrowth.number);
          expect(res.body).to.have.property("id");
        })
        .then((res) =>
          supertest(app)
            .get(`/api/growth/daniellerussell714@gmail.com`)
            .expect({
              0: {
                id: 1,
                sproutid: 2,
                title: "First growth test!",
                date: "11-23-2020",
                number: 1,
                units: "lbs",
                useremail: "daniellerussell714@gmail.com",
              },
              date: "",
              sproutid: "",
              title: "",
              useremail: "",
              units: "",
              number: "",
            })
        );
    });
  });
  describe(`PATCH /api/growth/:id`, () => {
    context("Given there are growth records in the database", () => {
      const testGrowth = [
        {
          id: 1,
          sproutid: "2",
          title: "First growth test!",
          date: "11-23-2020",
          number: 1,
          units: "lbs",
          useremail: "daniellerussell714@gmail.com",
        },
      ];

      const testSprout = {
        id: 2,
        name: "Christian",
        age: "10/10/2019",
        image: "",
        useremail: "daniellerussell714@gmail.com",
      };

      beforeEach("insert sprout", () => {
        return db.into("sprouts").insert(testSprout);
      });

      beforeEach("insert growth record", () => {
        return db.into("growth").insert(testGrowth);
      });

      it("responds with 204 and updates the growth record", () => {
        const idToUpdate = 1;
        const updateGrowth = {
          id: 1,
          sproutid: "2",
          title: "First growth test updated!",
          date: "11-23-2020",
          number: 1,
          units: "lbs",
          useremail: "daniellerussell714@gmail.com",
        };

        return supertest(app)
          .patch(`/api/growth/${idToUpdate}`)
          .send(updateGrowth)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/growth/daniellerussell714@gmail.com`)
              .expect({
                0: {
                  id: 1,
                  sproutid: 2,
                  title: "First growth test updated!",
                  date: "11-23-2020",
                  number: 1,
                  units: "lbs",
                  useremail: "daniellerussell714@gmail.com",
                },
                useremail: "",
                title: "",
                date: "",
                sproutid: "",
                number: "",
                units: "",
              })
          );
      });
    });
  });
  describe(`DELETE /api/growth/:id`, () => {
    const testGrowth = [
      {
        id: 1,
        sproutid: "2",
        title: "First growth test!",
        date: "11-23-2020",
        number: 1,
        units: "lbs",
        useremail: "daniellerussell714@gmail.com",
      },
    ];

    const testSprout = {
      id: 2,
      name: "Christian",
      age: "10/10/2019",
      image: "",
      useremail: "daniellerussell714@gmail.com",
    };

    context("Given there are sprouts in the database", () => {
      beforeEach("insert sprout", () => {
        return db.into("sprouts").insert(testSprout);
      });

      beforeEach("insert growth record", () => {
        return db.into("growth").insert(testGrowth);
      });
      it("responds with 204 and removes the growth record", () => {
        const idToRemove = 1;
        return supertest(app)
          .delete(`/api/growth/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/growth/daniellerussell714@gmail.com`)
              .expect({
                useremail: "",
                title: "",
                date: "",
                sproutid: "",
                number: "",
                units: "",
              })
          );
      });
    });
  });
});
