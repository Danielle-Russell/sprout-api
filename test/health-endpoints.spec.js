const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Health Endpoints', function() {
    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('cleanup', () => db.raw('TRUNCATE TABLE health, sprouts RESTART IDENTITY CASCADE;'));

    afterEach('cleanup', () => db.raw('TRUNCATE TABLE health, sprouts RESTART IDENTITY CASCADE;'));

describe("GET api/health/", () => {
    context('Given there are health records in the database', () => {
    
            const testHealth = [
              {
                id: 1,
                 sproutid: "2",
                 title: 'First test health!',
                 date: "11-23-2020",
                 time: "06:00",
                 notes: "First test health",
                 useremail: "daniellerussell714@gmail.com"
               },
               {
                id: 2,
                 sproutid: "2",
                 title: 'Second test health!',
                 date: "11-23-2020",
                 time: "06:00",
                 notes: "Second test health",
                 useremail: "indyshadow@gmail.com"
               }

            ]

               const testSprout = {
                
                  id: 2,
                  name: "Christian",
                  age: "10/10/2019",
                  image: "",
                  useremail: "daniellerussell714@gmail.com"
                 
               }
        
               beforeEach('insert sprout', () => {
                return db
                  .into('sprouts')
                  .insert(testSprout)
              })
 
             beforeEach('insert health record', () => {
               return db
                 .into('health')
                 .insert(testHealth)
             })


             it('GET /api/health responds with 200 and all of the health records', () => {
                    return supertest(app)
                       .get('/api/health')
                       .expect(200, testHealth)
                   })
                   it("GET /api/health/:useremail responds with 200 and the specified health", () => {
                    return supertest(app)
                      .get("/api/health/indyshadow@gmail.com")
                      .expect(200, {
                        0: {
                          id: 2,
                           sproutid: 2,
                           title: 'Second test health!',
                           date: "11-23-2020",
                           time: "06:00",
                           notes: "Second test health",
                           useremail: "indyshadow@gmail.com"
                         },
                        useremail: "",
                        title: "",
                        date: "",
                        time: "",
                        sproutid: "",
                        notes: ""
                      });
                  });
               
        })
  })

  
  describe(`POST /api/health`, () => {

    const testSprout = {
                
      id: 5,
      name: "Christian",
      age: "10/10/2019",
      image: "",
      useremail: "daniellerussell714@gmail.com"
     
   }


       beforeEach('insert sprout', () => {
      return db
        .into('sprouts')
        .insert(testSprout)
    })

    

    it(`creates a health record, responding with 201 and the new record`, () => {
      const testHealth = 
        {
          id: 1,
           sproutid: "5",
           title: 'First test health!',
           date: "11-23-2020",
           time: "06:00",
           notes: "First test health",
           useremail: "daniellerussell714@gmail.com"
         }
      

      return supertest(app)
        .post("/api/health")
        .send(testHealth)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(testHealth.title);
          expect(res.body.date).to.eql(testHealth.date);
          expect(res.body.time).to.eql(testHealth.time);
          expect(res.body.notes).to.eql(testHealth.notes);
          expect(res.body.useremail).to.eql(testHealth.useremail);
          expect(res.body).to.have.property("id");
          //expect(res.headers.location).to.eql(`/api/sprouts/daniellerussell714@gmail.com`);
        })
        .then((res) =>
          supertest(app)
            .get(`/api/health/daniellerussell714@gmail.com`)
            .expect( {
              "0":   {
              id: 1,
               sproutid: 5,
               title: 'First test health!',
               date: "11-23-2020",
               time: "06:00",
               notes: "First test health",
               useremail: "daniellerussell714@gmail.com"
             },
               "date": "",
             "notes": "",
              "sproutid": "",
              "time": "",
              "title": "",
               "useremail": ""
      })
        );
    });
  });
  describe(`PATCH /api/health/:id`, () => {
    context("Given there are health records in the database", () => {
      const testHealth = [
        {
          id: 1,
           sproutid: "2",
           title: 'First test health!',
           date: "11-23-2020",
           time: "06:00",
           notes: "First test health",
           useremail: "daniellerussell714@gmail.com"
         }
      ]

         const testSprout = {
          
            id: 2,
            name: "Christian",
            age: "10/10/2019",
            image: "",
            useremail: "daniellerussell714@gmail.com"
           
         }
  
         beforeEach('insert sprout', () => {
          return db
            .into('sprouts')
            .insert(testSprout)
        })

       beforeEach('insert health record', () => {
         return db
           .into('health')
           .insert(testHealth)
       })


      it("responds with 204 and updates the health record", () => {
        const idToUpdate = 1;
        const updateHealth =  {
          id: 1,
           sproutid: "2",
           title: 'First test health updated!',
           date: "11-23-2020",
           time: "06:00",
           notes: "First test health",
           useremail: "daniellerussell714@gmail.com"
         }

        return supertest(app)
          .patch(`/api/health/${idToUpdate}`)
          .send(updateHealth)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/health/daniellerussell714@gmail.com`)
              .expect({
                0: {
                  id: 1,
                   sproutid: 2,
                   title: 'First test health updated!',
                   date: "11-23-2020",
                   time: "06:00",
                   notes: "First test health",
                   useremail: "daniellerussell714@gmail.com"
                 },
                useremail: "",
                title: "",
                date: "",
                time: "",
                sproutid: "",
                notes: ""
                
              })
          );
      });
    });
  });
  describe(`DELETE /api/health/:id`, () => {
    const testHealth = [
      {
        id: 1,
         sproutid: "2",
         title: 'First test health!',
         date: "11-23-2020",
         time: "06:00",
         notes: "First test health",
         useremail: "daniellerussell714@gmail.com"
       }
    ]

       const testSprout = {
        
          id: 2,
          name: "Christian",
          age: "10/10/2019",
          image: "",
          useremail: "daniellerussell714@gmail.com"
         
       }

       
    context("Given there are sprouts in the database", () => {
      beforeEach('insert sprout', () => {
        return db
          .into('sprouts')
          .insert(testSprout)
      })

     beforeEach('insert health record', () => {
       return db
         .into('health')
         .insert(testHealth)
     })
      it("responds with 204 and removes the health record", () => {
        const idToRemove = 1;
        return supertest(app)
          .delete(`/api/health/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/health/daniellerussell714@gmail.com`)
              .expect({ useremail: "", title: "", date: "", time: "", notes: "", sproutid: "" })
          );
      });
    });
  });
})

