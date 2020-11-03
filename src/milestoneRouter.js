const path = require('path')
const express = require('express')
const xss = require('xss')
const MilestoneService = require('./milestoneService')

const MilestoneRouter = express.Router()
const jsonParser = express.json()

const sanitizeMilestone = mile=> ({
    ...mile,
    sproutId: xss(mile.sproutId),
	title: xss(mile.title),
    date: xss(mile.date),
    notes: xss(mile.notes)
})

MilestoneRouter
	.route('/')
	.get((req, res, next) => {
		MilestoneService.getAllMilestones(req.app.get('db'))
			.then(mile => {
				res.json(mile.map(sanitizeMilestone))
			})
			.catch(next)
	})
    
    .post(jsonParser, (req, res, next) => {
		const { sproutid, title, date, notes } = req.body
		const newMilestone= { sproutid, title, date, notes }

		// check for missing fields
		for (const [key, value] of Object.entries(newMilestone)) {
			if (value == null) {
				return res.status(400).json({
					error: { message: `Missing '${key}' in request body` }
				})
			}
		}

		MilestoneService.insertMilestone(req.app.get('db'), newMilestone)
			.then(mile => {
				res.status(201)
					.location(path.posix.join(req.originalUrl, `${mile.id}`))
					.json(sanitizeMilestone(mile))
			})
			.catch(next)
	})

MilestoneRouter
	.route('/:id')
	.all((req, res, next) => {
		MilestoneService.getById(req.app.get('db'), req.params.id)
			.then(mile => {
				if (!mile) {
					return res.status(404).json({
						error: { message: `Milestone entry doesn't exist` }
					})
				}
				res.mile = mile
				next() 
			})
			.catch(next)
	})
	.get((req, res, next) => {
		res.json(sanitizeMilestone(res.mile))
	})
	.patch(jsonParser, (req, res, next) => {
		const { sproutId, title, date, notes } = req.body
		const milestoneToUpdate = { sproutId, title, date, notes }

		if (!sproutId) {
			return res.status(400).json({
				error: {
					message: `Request body must contain a 'sproutId'`
				}
			})
		}

		if (!title) {
			return res.status(400).json({
				error: {
					message: `Request body must contain a 'title'`
				}
			})
        }
        
        if (!date) {
			return res.status(400).json({
				error: {
					message: `Request body must contain a 'date'`
				}
			})
		}

      
MilestoneService.updateMilestone(
			req.app.get('db'),
			req.params.id,
			milestoneToUpdate
		)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})
	.delete((req, res, next) => {
		MilestoneService.deleteMilestone(req.app.get('db'), req.params.id)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})

module.exports = MilestoneRouter