const path = require('path');
const express = require('express');
const AuthService = require('./authService');
const bcrypt = require('bcryptjs');


const AuthRouter = express.Router();
const jsonParser = express.json();

AuthRouter
.get('/', (req, res, next) => {
	AuthService.getAllUsers(req.app.get('db'))
		.then(user => {
			res.json(user.map(AuthService.serializeUser))
		})
		.catch(next)
})
.post('/', jsonParser, (req, res, next) => {
    const { password, firstname, lastname, email } = req.body;

for (const field of ['firstname', 'lastname', 'email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });


    const passwordError = AuthService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    AuthService.hasUserWithUserName(
      req.app.get('db'),
      email
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `This email has already been registered` })

        return AuthService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
			  firstname,
			  lastname,
			  email,
			  password: hashedPassword
            }

            return AuthService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(AuthService.serializeUser(user))
              })
          })
      })
	  .catch(next)
	})
  


    /*
    AuthRouter.post(jsonParser, (req, res, next) => {
		const { firstname, lastname, email, password } = req.body
		const newUser = { firstname, lastname, email, password }

		for (const [key, value] of Object.entries(newUser)) {
			if (value == null) {
				return res.status(400).json({
					error: { message: `Missing '${key}' in request body` }
				})
			}
		}
		AuthService.hashPassword(password)
		.then(hashedPassword => {
			const newUser = { firstname, lastname, email, password: hashedPassword }
		}
		  
	,
	AuthService.insertUser(req.app.get('db'), newUser)
			.then(user => {
				res.status(201)
					.location(path.posix.join(req.originalUrl, `${user.id}`))
					.json(sanitizeUser(user))
			})
			.catch(error => {
				return res.status(406).json({message: 'username already in use'})
			})
	})*/


	

	/*AuthRouter
	.route('/:id')
	.all((req, res, next) => {
		AuthService.getById(req.app.get('db'), req.params.id)
			.then(user=> {
				if (!user) {
					return res.status(404).json({
						error: { message: `User doesn't exist` }
					})
				}
				res.user = user
				next() 
			})
			.catch(next)
		})
	.patch(jsonParser, (req, res, next) => {
		const { firstname, lastname, email, password } = req.body
		const userToUpdate = { firstname, lastname, email, password }
		
		AuthService.updateUser(
			req.app.get('db'),
			req.params.id,
			userToUpdate
		)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
		})

	

	*/
	
	AuthRouter
  .post('/login', jsonParser, (req, res, next) => {
    const { email, password } = req.body
    const loginUser = { email, password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    AuthService.getUserWithUserName(
	  req.app.get('db'),
	  loginUser.email,
    )
      .then(dbUser => {

        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect username or password',
		  })
		 
		return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect username or password',
              })
            const sub = dbUser.email
            const payload = { id: dbUser.user_id }
            res.send({
			  authToken: AuthService.createJwt(sub, payload),
			  user: dbUser
            })
          })
      })
      .catch(next)
  })
  /*AuthRouter
	.route('/:email')
	.get((req, res, next) => {
		AuthService.getUserWithUserName(req.app.get('db'))
			.then(user => {
				res.json(user.map(AuthService.serializeUser))
			})
			.catch(next)
	})
  .delete((req, res, next) => {
	AuthService.deleteUser(req.app.get('db'), req.params.email)
		.then(() => {
			res.status(204).end()
		})
		.catch(next)
})
  
  */


	

 
module.exports = AuthRouter