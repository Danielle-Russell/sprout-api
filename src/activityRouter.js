const path = require("path");
const express = require("express");
const xss = require("xss");
const ActivityService = require("./activityService");
const { requireAuth } = require("./middleware/jwt-auth");

const ActivityRouter = express.Router();
const jsonParser = express.json();

const sanitizeActivity = (activity) => ({
  ...activity,
  useremail: xss(activity.useremail),
  sproutid: xss(activity.sproutid),
  title: xss(activity.title),
  date: xss(activity.date),
  time: xss(activity.time),
  notes: xss(activity.notes),
});

ActivityRouter.route("/")
  .get((req, res, next) => {
    ActivityService.getAllActivities(req.app.get("db"))
      .then((Activities) => {
        res.json(Activities.map(sanitizeActivity));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { useremail, sproutid, title, date, time, notes } = req.body;
    const newActivity = { useremail, sproutid, title, date, time, notes };

    // check for missing fields
    for (const [key, value] of Object.entries(newActivity)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    ActivityService.insertActivity(req.app.get("db"), newActivity)
      .then((activity) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${activity.id}`))
          .json(sanitizeActivity(activity));
      })
      .catch(next);
  });

ActivityRouter.route("/:useremail")
  .all((req, res, next) => {
    ActivityService.getByEmail(req.app.get("db"), req.params.useremail)
      .then((activity) => {
        if (!activity) {
          return res.status(404).json({
            error: { message: `Activity entry doesn't exist` },
          });
        }
        res.activity = activity;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(sanitizeActivity(res.activity));
  });
ActivityRouter.route("/:id")
  .all((req, res, next) => {
    ActivityService.getById(req.app.get("db"), req.params.id)
      .then((activity) => {
        if (!activity) {
          return res.status(404).json({
            error: { message: `Activity entry doesn't exist` },
          });
        }
        res.activity = activity;
        next();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { useremail, sproutid, title, date, time, notes } = req.body;
    const activityToUpdate = { useremail, sproutid, title, date, time, notes };

    if (!sproutid) {
      return res.status(400).json({
        error: {
          message: `Request body must contain a 'sproutId'`,
        },
      });
    }

    if (!title) {
      return res.status(400).json({
        error: {
          message: `Request body must contain a 'title'`,
        },
      });
    }

    if (!date) {
      return res.status(400).json({
        error: {
          message: `Request body must contain a 'date'`,
        },
      });
    }

    ActivityService.updateActivity(
      req.app.get("db"),
      req.params.id,
      activityToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    ActivityService.deleteActivity(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = ActivityRouter;
