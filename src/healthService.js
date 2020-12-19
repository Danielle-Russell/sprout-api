const HealthService = {
	getAllHealth(knex) {
		return knex
			.select('*')
			.from('health')
			.orderBy('id', 'asc')
	},
	insertHealth(knex, newHealth) {
		return knex
			.insert(newHealth)
			.into('health')
			.returning('*')
			.then(rows => rows[0])
	},
	getById(knex, id) {
		return knex
			.from('health')
			.select('*')
			.where('id', id)
			.first()
	},
	getByEmail(knex, useremail) {
		return knex
			.from('health')
			.select('*')
			.where('useremail', useremail)
	},
	deleteHealth(knex, id) {
		return knex('health')
			.where({ id })
			.delete()
	},
	updateHealth(knex, id, newHealthFields) {
		return knex('health')
			.where({ id })
			.update(newHealthFields)
	}
};

module.exports = HealthService