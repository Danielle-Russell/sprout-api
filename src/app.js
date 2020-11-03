require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const router = require('./router')
const activityRouter = require('./activityRouter')
const healthRouter = require('./healthRouter')
const milestoneRouter = require('./milestoneRouter')
const growthRouter = require('./growthRouter')

const app = express()

app.use("/api/sprouts", router)

app.use("/api/activities", activityRouter)

app.use("/api/health", healthRouter)

app.use("/api/milestones", milestoneRouter)

app.use("/api/growth", growthRouter)




const { NODE_ENV } = require('./config')

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

  const {CLIENT_ORIGIN} = require('./config');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use(morgan(morganOption))

app.use(helmet())

app.use(cors())

     app.use(function errorHandler(error, req, res, next) {
          let response
           if (NODE_ENV === 'production') {
             response = { error: { message: 'server error' } }
           } else {
             console.error(error)
             response = { message: error.message, error }
           }
           res.status(500).json(response)
         })
    

module.exports = app
