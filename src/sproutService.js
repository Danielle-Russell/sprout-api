const SproutService = {
	getAllSprouts(knex) {
		return knex
			.select('*')
			.from('sprouts')
			.orderBy('id', 'asc')
	},
	insertSprout(knex, newSprout) {
		return knex
			.insert(newSprout)
			.into('sprouts')
			.returning('*')
			.then(rows => rows[0])
	},
	getByEmail(knex, useremail) {
		return knex
			.from('sprouts')
			.select('*')
			.where('useremail', useremail)
	},
	deleteSprout(knex, id) {
		return knex('sprouts')
			.where({ id })
			.delete()
	},
	updateSprout(knex, id, newSproutFields) {
		return knex('sprouts')
			.where({ id })
			.update(newSproutFields)
	}
};

module.exports = SproutService