## Summary

The API for my sprout client has get, post, patch, and delete endpoints for each PostgreSQL table. Each is linked to a useremail to assign inputs to user accounts.

## Technologies Used

This API was built using Node.js with Express and Express.Router. The database was built using PostgreSQL. I used JWT and bCrypt plugins for user logins.

# Sprout API Documentation

## Live Link: https://sprout-app-mu.vercel.app/

<hr>

### User Accounts and Logins

#### POST api/users

| Field  | Required           | Description |
| --------- | ------------------- | --------- |
| firstname |      Yes               |  |
| lastname   | Yes | | 
| email  | Yes | Must be a valid email that is not currently in use | 
| password  | Yes | Must be >= 8 characters | 

#### POST api/users/login

Takes username and password, generating a unique token if matched in the system. 

#### GET api/users/:useremail

Get user email, firstname and lastname

#### DELETE api/users/:useremail

Delete user


### TYPES - Activities, Growth, Milestones, Health

#### GET /api/<em>type</em>
Returns all

#### GET /api/<em>type</em>/:useremail 

Returns a list of all logs in specificed type logged for a certain user account

#### GET api/<em>type</em>/:id

Returns a list of all logs for a particular profile within a user account, in this case by the "sprout id".


#### POST /api/<em>type</em> 

| Field  | Required           | Description | Type |
| --------- | ------------------- | --------- | ------- |
| useremail |      Yes               | Relates to previously created user account    | All |
| sproutid    | Yes | Profile ID for previously created "sprout" | All |
| title   | Yes | Type of activity (Feed, Diaper, Sleep) | All |
| date   | Yes | YYYY-MM-DD | All |
| time    | Yes | HH:mm | Activities, growth, health |
| notes    | Yes |  | All |

#### PATCH api/<em>type</em>/:id

Update log

#### DELETE api/<em>type</em>/:id

Delete log


