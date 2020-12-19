const ActivityService = {
  getAllActivities(knex) {
    return knex.select("*").from("activities").orderBy("id", "asc");
  },
  insertActivity(knex, newActivity) {
    return knex
      .insert(newActivity)
      .into("activities")
      .returning("*")
      .then((rows) => rows[0]);
  },
  getById(knex, id) {
    return knex.from("activities").select("*").where("id", id).first();
  },
  getByEmail(knex, useremail) {
    return knex.from("activities").select("*").where("useremail", useremail);
  },
  deleteActivity(knex, id) {
    return knex("activities").where({ id }).delete();
  },
  updateActivity(knex, id, newActivityFields) {
    return knex("activities").where({ id }).update(newActivityFields);
  },
};

module.exports = ActivityService;
