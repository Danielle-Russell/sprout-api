const GrowthService = {
	getAllGrowth(knex) {
		return knex
			.select('*')
			.from('growth')
			.orderBy('id', 'asc')
	},
	insertGrowth(knex, newGrowth) {
		return knex
			.insert(newGrowth)
			.into('growth')
			.returning('*')
			.then(rows => rows[0])
	},
	getById(knex, id) {
		return knex
			.from('growth')
			.select('*')
			.where('id', id)
			.first()
	},
	getByEmail(knex, useremail) {
		return knex
			.from('growth')
			.select('*')
			.where('useremail', useremail)
	},
	deleteGrowth(knex, id) {
		return knex('growth')
			.where({ id })
			.delete()
	},
	updateGrowth(knex, id, newGrowthFields) {
		return knex('growth')
			.where({ id })
			.update(newGrowthFields)
	}
}

module.exports = GrowthService