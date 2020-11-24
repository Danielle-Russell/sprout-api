const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Activity Endpoints', function() {
    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db('activities').truncate())

    context('Given there are activities in the database', () => {
            const testActivity = [
              {
                 sproutid: 1,
                 title: 'First test activity!',
                 date: "11-23-2020",
                 time: "06:00",
                 notes: "First test activity"
               },
               {
                sproutid: 2,
                title: 'Second test activity!',
                date: "11-23-2020",
                time: "06:00",
                notes: "Second test activity"
              },
              {
                sproutid: 1,
                title: 'Second test activity!',
                date: "11-23-2020",
                time: "06:00",
                notes: "Second test activity"
              },
              {
                sproutid: 1,
                title: 'Second test activity!',
                date: "11-23-2020",
                time: "06:00",
                notes: "Second test activity"
              },
             ];
        
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
                   it('GET /activities/:activity_id responds with 200 and the specified activity', () => {
                    const activityId = 2
                    const expectedActivity = testActivity[activityId - 1]
                    return supertest(app)
                      .get(`/api/activities/${activityId}`)
                      .expect(200, expectedActivity)
           })
        })
  })