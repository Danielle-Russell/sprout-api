const MilestoneService = {
	getAllMilestones(knex) {
		return knex
			.select('*')
			.from('milestones')
			.orderBy('id', 'asc')
	},
	insertMilestone(knex, newMilestone) {
		return knex
			.insert(newMilestone)
			.into('milestones')
			.returning('*')
			.then(rows => rows[0])
	},
	getById(knex, id) {
		return knex
			.from('milestones')
			.select('*')
			.where('id', id)
			.first()
	},
	deleteMilestone(knex, id) {
		return knex('milestones')
			.where({ id })
			.delete()
	},
	updateMilestone(knex, id, newMilestoneFields) {
		return knex('milestones')
			.where({ id })
			.update(newMilestoneFields)
	}
}

module.exports = MilestoneService