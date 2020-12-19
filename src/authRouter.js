const path = require("path");
const express = require("express");
const AuthService = require("./authService");
const bcrypt = require("bcryptjs");

const AuthRouter = express.Router();
const jsonParser = express.json();

AuthRouter.get("/", (req, res, next) => {
  AuthService.getAllUsers(req.app.get("db"))
    .then((user) => {
      res.json(user.map(AuthService.serializeUser));
    })
    .catch(next);
}).post("/", jsonParser, (req, res, next) => {
  const { password, firstname, lastname, email } = req.body;

  for (const field of ["firstname", "lastname", "email", "password"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`,
      });

  const passwordError = AuthService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  AuthService.hasUserWithUserName(req.app.get("db"), email)
    .then((hasUserWithUserName) => {
      if (hasUserWithUserName)
        return res
          .status(400)
          .json({ error: `This email has already been registered` });

      return AuthService.hashPassword(password).then((hashedPassword) => {
        const newUser = {
          firstname,
          lastname,
          email,
          password: hashedPassword,
        };

        return AuthService.insertUser(req.app.get("db"), newUser).then(
          (user) => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(AuthService.serializeUser(user));
          }
        );
      });
    })
    .catch(next);
});

AuthRouter.post("/login", jsonParser, (req, res, next) => {
  const { email, password } = req.body;
  const loginUser = { email, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  AuthService.getUserWithUserName(req.app.get("db"), loginUser.email)
    .then((dbUser) => {
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect username or password",
        });

      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: "Incorrect username or password",
          });
        const sub = dbUser.email;
        const payload = { id: dbUser.user_id };
        res.send({
          authToken: AuthService.createJwt(sub, payload),
          user: dbUser,
        });
      });
    })
    .catch(next);
});

module.exports = AuthRouter;
