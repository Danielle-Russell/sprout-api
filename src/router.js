const path = require('path')
const express = require('express')
const xss = require('xss')
const SproutService = require('./sproutService')

const router = express.Router()
const jsonParser = express.json()

const sanitizeSprout = sprout => ({
	...sprout,
	useremail: xss(sprout.useremail),
	name: xss(sprout.name),
	age: xss(sprout.age),
	image: xss(sprout.image)
})

router
	.route('/')
	.get((req, res, next) => {
		SproutService.getAllSprouts(req.app.get('db'))
			.then(Sprouts => {
				res.json(Sprouts.map(sanitizeSprout))
			})
			.catch(next)
	})
    .post(jsonParser, (req, res, next) => {
		const { useremail, name, age, image } = req.body
		const newSprout = { useremail, name, age, image }

		// check for missing fields
		for (const [key, value] of Object.entries(newSprout)) {
			if (value == null) {
				return res.status(400).json({
					error: { message: `Missing '${key}' in request body` }
				})
			}
		}

		SproutService.insertSprout(req.app.get('db'), newSprout)
			.then(sprout => {
				res.status(201)
					.location(path.posix.join(req.originalUrl, `${sprout.id}`))
					.json(sanitizeSprout(sprout))
			})
			.catch(next)
	})

router
	.route('/:id')
	/*.all((req, res, next) => {
		SproutService.getById(req.app.get('db'), req.params.id)
			.then(sprout => {
				if (!sprout) {
					return res.status(404).json({
						error: { message: `Sprout doesn't exist` }
					})
				}
				res.sprout = sprout 
				next() 
			})
			.catch(next)
	})
	.get((req, res, next) => {
		res.json(sanitizeSprout(res.sprout))
	})*/
	.patch(jsonParser, (req, res, next) => {
		const { name, age, useremail, image } = req.body
		const sproutToUpdate = { name, age, useremail, image }

		if (!name) {
			return res.status(400).json({
				error: {
					message: `Request body must contain a 'name'`
				}
			})
		}

		if (!age) {
			return res.status(400).json({
				error: {
					message: `Request body must contain an 'age'`
				}
			})
		}

		SproutService.updateSprout(
			req.app.get('db'),
			req.params.id,
			sproutToUpdate
		)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})
	.delete((req, res, next) => {
		SproutService.deleteSprout(req.app.get('db'), req.params.id)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})

	router
	.route('/:useremail')
	.all((req, res, next) => {
		SproutService.getByEmail(req.app.get('db'), req.params.useremail)
			.then(sprout => {
				if (!sprout) {
					return res.status(404).json({
						error: { message: `Sprout doesn't exist` }
					})
				}
				res.sprout = sprout 
				next() 
			})
			.catch(next)
	})
	.get((req, res, next) => {
		res.json(sanitizeSprout(res.sprout))
	})
	
    
module.exports = router