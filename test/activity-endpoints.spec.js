const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe.only("Activity Endpoints", function () {
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
    db.raw("TRUNCATE TABLE activities, sprouts RESTART IDENTITY CASCADE;")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE activities, sprouts RESTART IDENTITY CASCADE;")
  );

  describe("GET api/activities/", () => {
    context("Given there are activities in the database", () => {
      const testActivity = [
        {
          id: 1,
          sproutid: "2",
          title: "First test activity!",
          date: "11-23-2020",
          time: "06:00",
          notes: "First test activity",
          useremail: "daniellerussell714@gmail.com",
        },
        {
          id: 2,
          sproutid: "2",
          title: "Second test activity!",
          date: "11-23-2020",
          time: "06:00",
          notes: "Second test activity",
          useremail: "indyshadow@gmail.com",
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

      beforeEach("insert activities", () => {
        return db.into("activities").insert(testActivity);
      });

      it("GET /api/activities responds with 200 and all of the activities", () => {
        return supertest(app).get("/api/activities").expect(200, testActivity);
      });
      it("GET /api/activities/:useremail responds with 200 and the specified activity", () => {
        return supertest(app)
          .get("/api/activities/indyshadow@gmail.com")
          .expect(200, {
            0: {
              id: 2,
              sproutid: 2,
              title: "Second test activity!",
              date: "11-23-2020",
              time: "06:00",
              notes: "Second test activity",
              useremail: "indyshadow@gmail.com",
            },
            useremail: "",
            title: "",
            date: "",
            time: "",
            sproutid: "",
            notes: "",
          });
      });
    });
  });

  describe(`POST /api/activities`, () => {
    const testSprout = {
      id: 5,
      name: "Christian",
      age: "10/10/2019",
      image: "",
      useremail: "daniellerussell714@gmail.com",
    };

    beforeEach("insert sprout", () => {
      return db.into("sprouts").insert(testSprout);
    });

    it(`creates an activity, responding with 201 and the new activity`, () => {
      const testActivity = {
        id: 1,
        sproutid: "5",
        title: "First test activity!",
        date: "11-23-2020",
        time: "06:00",
        notes: "First test activity",
        useremail: "daniellerussell714@gmail.com",
      };

      return supertest(app)
        .post("/api/activities")
        .send(testActivity)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(testActivity.title);
          expect(res.body.date).to.eql(testActivity.date);
          expect(res.body.time).to.eql(testActivity.time);
          expect(res.body.notes).to.eql(testActivity.notes);
          expect(res.body.useremail).to.eql(testActivity.useremail);
          expect(res.body).to.have.property("id");
        })
        .then((res) =>
          supertest(app)
            .get(`/api/activities/daniellerussell714@gmail.com`)
            .expect({
              0: {
                id: 1,
                sproutid: 5,
                title: "First test activity!",
                date: "11-23-2020",
                time: "06:00",
                notes: "First test activity",
                useremail: "daniellerussell714@gmail.com",
              },
              date: "",
              notes: "",
              sproutid: "",
              time: "",
              title: "",
              useremail: "",
            })
        );
    });
  });
  describe(`PATCH /api/activities/:id`, () => {
    context("Given there are activities in the database", () => {
      const testActivity = [
        {
          id: 1,
          sproutid: "2",
          title: "First test activity!",
          date: "11-23-2020",
          time: "06:00",
          notes: "First test activity",
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

      beforeEach("insert activities", () => {
        return db.into("activities").insert(testActivity);
      });

      it("responds with 204 and updates the activity", () => {
        const idToUpdate = 1;
        const updateActivity = {
          id: 1,
          sproutid: "2",
          title: "First test activity updated!",
          date: "11-23-2020",
          time: "06:00",
          notes: "First test activity",
          useremail: "daniellerussell714@gmail.com",
        };

        return supertest(app)
          .patch(`/api/activities/${idToUpdate}`)
          .send(updateActivity)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/activities/daniellerussell714@gmail.com`)
              .expect({
                0: {
                  id: 1,
                  sproutid: 2,
                  title: "First test activity updated!",
                  date: "11-23-2020",
                  time: "06:00",
                  notes: "First test activity",
                  useremail: "daniellerussell714@gmail.com",
                },
                useremail: "",
                title: "",
                date: "",
                time: "",
                sproutid: "",
                notes: "",
              })
          );
      });
    });
  });
  describe(`DELETE /api/activities/:id`, () => {
    const testActivity = [
      {
        id: 1,
        sproutid: "2",
        title: "First test activity!",
        date: "11-23-2020",
        time: "06:00",
        notes: "First test activity",
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

      beforeEach("insert activities", () => {
        return db.into("activities").insert(testActivity);
      });
      it("responds with 204 and removes the activity", () => {
        const idToRemove = 1;
        return supertest(app)
          .delete(`/api/activities/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/activities/daniellerussell714@gmail.com`)
              .expect({
                useremail: "",
                title: "",
                date: "",
                time: "",
                notes: "",
                sproutid: "",
              })
          );
      });
    });
  });
});
