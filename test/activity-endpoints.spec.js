const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Activity Endpoints', function() {
    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('cleanup', () => db.raw('TRUNCATE TABLE activities RESTART IDENTITY CASCADE;'));

    afterEach('cleanup', () => db.raw('TRUNCATE TABLE activities RESTART IDENTITY CASCADE;'));


    context('Given there are activities in the database', () => {
    
            const testActivity = [
              {
                id: 1,
                 sproutid: "1",
                 title: 'First test activity!',
                 date: "11-23-2020",
                 time: "06:00",
                 notes: "First test activity",
                 useremail: "daniellerussell714@gmail.com"
               }
            ]

               const testSprout = {
                
                  id: 1,
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
 
             beforeEach('insert activities', () => {
               return db
                 .into('activities')
                 .insert(testActivity)
             })


             it('GET /api/activities responds with 200 and all of the activities', () => {
                    return supertest(app)
                       .get('/api/activities')
                       .expect(200, testActivity)
                   })
        })
  })