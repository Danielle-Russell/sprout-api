const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Sprouts Endpoints', function() {
    let db
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  

    before('clean the table', () => db('activities', 'growth', 'milestones', 'heatlh', 'sprouts').truncate())

    afterEach(() => db('activities', 'growth', 'milestones', 'heatlh', 'sprouts').truncate())

    context('Given there are sprouts in the database', () => {
            const testSprouts = [
              {
                id: 1,
                name: "Christian",
                age: "10/10/2019",
                image: "",
                useremail: "daniellerussell714@gmail.com"
               },
               {
                 id: 2,
                name: "Elizabeth",
                age: "10/10/2019",
                image: "",
                useremail: "daniellerussell714@gmail.com"
              },
              {
               id: 3,
                name: "Benjamin",
                age: "10/10/2019",
                image: "",
                useremail: "daniellerussell714@gmail.com"
              },
              {
                id: 4,
                name: "Olivia",
                age: "10/10/2019",
                image: "",
                useremail: "daniellerussell714@gmail.com"
              },
             ];
        
             beforeEach('insert sprouts', () => {
               return db
                 .into('sprouts')
                 .insert(testSprouts)
             })
             it('GET /api/sprouts responds with 200 and all of the sprouts', () => {
                    return supertest(app)
                       .get('/api/sprouts')
                       .expect(200, testSprouts)
                   })
        })
      })