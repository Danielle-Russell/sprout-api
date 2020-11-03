const path = require('path')
const express = require('express')
const xss = require('xss')
const GrowthService = require('./growthService')

const GrowthRouter = express.Router()
const jsonParser = express.json()

const sanitizeGrowth = growth => ({
    ...growth,
    sproutId: xss(growth.sproutId),
	title: xss(growth.title),
    date: xss(growth.date),
    number: xss(growth.number),
    units: xss(growth.units)
})

GrowthRouter
	.route('/')
	.get((req, res, next) => {
		GrowthService.getAllGrowth(req.app.get('db'))
			.then(growth => {
				res.json(growth.map(sanitizeGrowth))
			})
			.catch(next)
	})
    
    .post(jsonParser, (req, res, next) => {
		const { sproutid, title, date, number, units } = req.body
		const newGrowth = { sproutid, title, date, number, units }

		// check for missing fields
		for (const [key, value] of Object.entries(newGrowth)) {
			if (value == null) {
				return res.status(400).json({
					error: { message: `Missing '${key}' in request body` }
				})
			}
		}

		GrowthService.insertGrowth(req.app.get('db'), newGrowth)
			.then(growth => {
				res.status(201)
					.location(path.posix.join(req.originalUrl, `${growth.id}`))
					.json(sanitizeGrowth(growth))
			})
			.catch(next)
	})

GrowthRouter
	.route('/:id')
	.all((req, res, next) => {
		GrowthService.getById(req.app.get('db'), req.params.id)
			.then(growth => {
				if (!growth) {
					return res.status(404).json({
						error: { message: `Growth entry doesn't exist` }
					})
				}
				res.growth = growth
				next() 
			})
			.catch(next)
	})
	.get((req, res, next) => {
		res.json(sanitizeGrowth(res.growth))
	})
	.patch(jsonParser, (req, res, next) => {
		const { sproutId, title, date, number, units } = req.body
		const growthToUpdate = { sproutId, title, date,  number, units }

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

        if (!number) {
			return res.status(400).json({
				error: {
					message: `Request body must contain a 'number'`
				}
			})
        }
        if (!units) {
			return res.status(400).json({
				error: {
					message: `Request body must contain a 'units'`
				}
			})
		}
      
		GrowthService.updateGrowth(
			req.app.get('db'),
			req.params.id,
			growthToUpdate
		)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})
	.delete((req, res, next) => {
		GrowthService.deleteGrowth(req.app.get('db'), req.params.id)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})

module.exports = GrowthRouter