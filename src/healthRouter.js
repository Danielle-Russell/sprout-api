const path = require('path')
const express = require('express')
const xss = require('xss')
const HealthService = require('./healthService')

const HealthRouter = express.Router()
const jsonParser = express.json()

const sanitizeHealth = health => ({
    ...health,
    sproutId: xss(health.sproutId),
	title: xss(health.title),
    date: xss(health.date),
    time: xss(health.time),
    notes: xss(health.notes)
})

HealthRouter
	.route('/')
	.get((req, res, next) => {
		HealthService.getAllHealth(req.app.get('db'))
			.then(health=> {
				res.json(health.map(sanitizeHealth))
			})
			.catch(next)
	})
    
    .post(jsonParser, (req, res, next) => {
		const { sproutid, title, date, time, notes } = req.body
		const newHealth = { sproutid, title, date, time, notes }

		// check for missing fields
		for (const [key, value] of Object.entries(newHealth)) {
			if (value == null) {
				return res.status(400).json({
					error: { message: `Missing '${key}' in request body` }
				})
			}
		}

		HealthService.insertHealth(req.app.get('db'), newHealth)
			.then(health => {
				res.status(201)
					.location(path.posix.join(req.originalUrl, `${health.id}`))
					.json(sanitizeHealth(health))
			})
			.catch(next)
	})

HealthRouter
	.route('/:id')
	.all((req, res, next) => {
		HealthService.getById(req.app.get('db'), req.params.id)
			.then(health => {
				if (!health) {
					return res.status(404).json({
						error: { message: `Health entry doesn't exist` }
					})
				}
				res.health= health
				next() 
			})
			.catch(next)
	})
	.get((req, res, next) => {
		res.json(sanitizeHealth(res.health))
	})
	.patch(jsonParser, (req, res, next) => {
		const { sproutId, title, date, time, notes } = req.body
		const healthToUpdate = { sproutId, title, date, time, notes }

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

      
		HealthService.updateHealth(
			req.app.get('db'),
			req.params.id,
			healthToUpdate
		)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})
	.delete((req, res, next) => {
		HealthService.deleteHealth(req.app.get('db'), req.params.id)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})

    module.exports = HealthRouter