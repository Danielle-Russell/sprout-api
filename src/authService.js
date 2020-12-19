const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("./config");
const xss = require("xss");

const AuthService = {
  serializeUser(user) {
    return {
      id: user.id,
      firstname: xss(user.firstname),
      lastname: xss(user.lastname),
      email: xss(user.email),
    };
  },
  getAllUsers(knex) {
    return knex.select("*").from("users").orderBy("id", "asc");
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  deleteUser(knex, email) {
    return knex("users").where({ email }).delete();
  },
  updateUser(knex, id, newUserFields) {
    return knex("users").where({ id }).update(newUserFields);
  },
  hasUserWithUserName(db, email) {
    return db("users")
      .where({ email })
      .first()
      .then((user) => !!user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  getUserWithUserName(db, email) {
    return db("users").where({ email }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: "HS256",
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  },
  parseBasicToken(token) {
    return Buffer.from(token, "base64");
  },
};

module.exports = AuthService;
