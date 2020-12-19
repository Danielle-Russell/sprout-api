const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Milestone Endpoints', function() {
    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('cleanup', () => db.raw('TRUNCATE TABLE milestones, sprouts RESTART IDENTITY CASCADE;'));

    afterEach('cleanup', () => db.raw('TRUNCATE TABLE milestones, sprouts RESTART IDENTITY CASCADE;'));

describe("GET api/milestones/", () => {
    context('Given there are milestones in the database', () => {
    
            const testMile = [
              {
                id: 1,
                 sproutid: "2",
                 title: 'First test milestone!',
                 date: "11-23-2020",
                 notes: "First test milestone",
                 image: "",
                 useremail: "daniellerussell714@gmail.com"
               },
               {
                id: 2,
                 sproutid: "2",
                 title: 'Second test milestone!',
                 date: "11-23-2020",
                 image: "",
                 notes: "Second test milestone",
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
 
             beforeEach('insert milestone', () => {
               return db
                 .into('milestones')
                 .insert(testMile)
             })


             it('GET /api/milestones responds with 200 and all of the milestones', () => {
                    return supertest(app)
                       .get('/api/milestones')
                       .expect(200, testMile)
                   })
                   it("GET /api/milestonese/:useremail responds with 200 and the specified milestonese", () => {
                    return supertest(app)
                      .get("/api/milestones/indyshadow@gmail.com")
                      .expect(200, {
                        0: {
                          id: 2,
                           sproutid: 2,
                           title: 'Second test milestone!',
                           date: "11-23-2020",
                           image: "",
                           notes: "Second test milestone",
                           useremail: "indyshadow@gmail.com"
                         },
                        useremail: "",
                        title: "",
                        date: "",
                        image: "",
                        sproutid: "",
                        notes: ""
                      });
                  });
               
        })
  })

  
  describe(`POST /api/milestones`, () => {

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

    

    it(`creates a milestone, responding with 201 and the new record`, () => {
      const testMile = 
        {
          id: 1,
           sproutid: "5",
           title: 'First test milestone!',
           date: "11-23-2020",
           image: "",
           notes: "First test milestone",
           useremail: "daniellerussell714@gmail.com"
         }
      

      return supertest(app)
        .post("/api/milestones")
        .send(testMile)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(testMile.title);
          expect(res.body.date).to.eql(testMile.date);
          expect(res.body.image).to.eql(testMile.image);
          expect(res.body.notes).to.eql(testMile.notes);
          expect(res.body.useremail).to.eql(testMile.useremail);
          expect(res.body).to.have.property("id");
        })
        .then((res) =>
          supertest(app)
            .get(`/api/milestones/daniellerussell714@gmail.com`)
            .expect( {
              "0":   {
              id: 1,
               sproutid: 5,
               title: 'First test milestone!',
               date: "11-23-2020",
               image: "",
               notes: "First test milestone",
               useremail: "daniellerussell714@gmail.com"
             },
               "date": "",
             "notes": "",
              "sproutid": "",
              "image": "",
              "title": "",
               "useremail": ""
      })
        );
    });
  });
  describe(`PATCH /api/milestones/:id`, () => {
    context("Given there are milestone records in the database", () => {
      const testMile = [
        {
          id: 1,
           sproutid: "2",
           title: 'First test milestone!',
           date: "11-23-2020",
           image: "",
           notes: "First test milestone",
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

       beforeEach('insert milestone record', () => {
         return db
           .into('milestones')
           .insert(testMile)
       })


      it("responds with 204 and updates the milestones record", () => {
        const idToUpdate = 1;
        const updateMile =  {
          id: 1,
           sproutid: "2",
           title: 'First test milestone updated!',
           date: "11-23-2020",
           image: "",
           notes: "First test milestone",
           useremail: "daniellerussell714@gmail.com"
         }

        return supertest(app)
          .patch(`/api/milestones/${idToUpdate}`)
          .send(updateMile)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/milestones/daniellerussell714@gmail.com`)
              .expect({
                0: {
                  id: 1,
                   sproutid: 2,
                   title: 'First test milestone updated!',
                   date: "11-23-2020",
                   image: "",
                   notes: "First test milestone",
                   useremail: "daniellerussell714@gmail.com"
                 },
                useremail: "",
                title: "",
                date: "",
                image: "",
                sproutid: "",
                notes: ""
                
              })
          );
      });
    });
  });
  describe(`DELETE /api/milestones/:id`, () => {
    const testMile = [
      {
        id: 1,
         sproutid: "2",
         title: 'First test milestone!',
         date: "11-23-2020",
         image: "",
         notes: "First test milestone",
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

     beforeEach('insert milestone record', () => {
       return db
         .into('milestones')
         .insert(testMile)
     })
      it("responds with 204 and removes the milestone record", () => {
        const idToRemove = 1;
        return supertest(app)
          .delete(`/api/milestones/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/milestones/daniellerussell714@gmail.com`)
              .expect({ useremail: "", title: "", date: "", image: "", notes: "", sproutid: "" })
          );
      });
    });
  });
})

