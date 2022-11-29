require('dotenv/config');
const pg = require('pg');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const express = require('express');
const authorizationMiddleware = require('./authorization-middleware');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

// PATCH>> checks a user's password to make sure it matches before signing in

app.patch('/api/users/sign-in', (req, res, next) => {
  let userId = null;
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }

  const sql = `
    SELECT *
    FROM "users"
    WHERE "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(401, 'invalid login');
      } else {
        userId = result.rows[0].userId;
        const userPkmn = result.rows[0].userPkmn;
        argon2.verify(result.rows[0].hashPassword, password)
          .then(result => {
            if (!result) {
              throw new ClientError(401, 'invalid login');
            }
            const payload = { userId, username, userPkmn, ts: Date.now() };
            const token = jwt.sign(payload, process.env.TOKEN_SECRET);
            res.json({ token, user: payload });
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

// POST>> adds a user and their hashed password to the db //

app.post('/api/users/sign-up', (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }

  const sql = `
    SELECT *
    FROM "users"
    WHERE "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      if (result.rows[0]) {
        throw new ClientError(409, 'username already exists');
      } else {
        argon2.hash(password)
          .then(hashedPW => {
            const sql = `
             INSERT INTO "users" ("username", "email", "hashPassword")
             VALUES ($1, $2, $3)
             RETURNING *
            `;
            const params = [username, email, hashedPW];
            db.query(sql, params)
              .then(result => {
                const [newSignUp] = result.rows;
                const newUserId = newSignUp.userId;
                const userPkmn = newSignUp.userPkmn;

                const payload = { newUserId, username, userPkmn, ts: Date.now() };
                const token = jwt.sign(payload, process.env.TOKEN_SECRET);
                res.status(201).json({ token, user: payload, newSignUp });
              })
              .catch(err => next(err));
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));

});

// GET: all of the pkmn listed in the DB

app.get('/api/pkmn-list/all', (req, res, next) => {
  const sql = `
    SELECT *
    FROM "pokemon"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

// ROUTES THAT USE AUTHORIZATION //
app.use(authorizationMiddleware);

// PATCH: update user with newly selected pkmn

app.patch('/api/user-pkmn/:id', (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    throw new ClientError(400, 'id is required');
  }

  const { pokemon } = req.body;
  if (!pokemon) {
    throw new ClientError(400, 'must specify new pokemon id');
  }

  const sql = `
    SELECT * FROM "users"
    WHERE "userId" = $1
  `;
  const params = [id];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(400, 'user does not exist');
      } else {
        return result.rows[0];
      }
    })
    .then(user => {
      if (user.userPkmn === pokemon) {
        throw new ClientError(400, 'user has already picked this pokemon');
      } else {
        const sql = `
          UPDATE "users"
          SET "userPkmn" = $1
          WHERE "userId" = $2
          RETURNING "userId", "userPkmn"
        `;
        const params = [pokemon, id];

        db.query(sql, params)
          .then(result => {
            if (!result.rows[0]) {
              throw new ClientError(400, 'Something went wrong');
            } else {
              return result.rows[0];
            }
          })
          .then(updatedUser => {
            res.status(200).json(updatedUser);
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

// GET: a specific pkmn's data from the DB

app.get('/api/pkmn-list/:id', (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    throw new ClientError(400, 'id is required');
  }

  const sql = `
    SELECT *
    FROM "pokemon"
    WHERE "pokemonId" = $1
  `;
  const params = [id];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(400, 'pkmn does not exist');
      } else {
        res.status(200).json(result.rows[0]);
      }
    })
    .catch(err => next(err));
});

// GET: all of the Gym Leaders listed in the DB

app.get('/api/leader-list/all', (req, res, next) => {
  const fullList = [];
  const sql = `
    SELECT *
    FROM "leaders"
  `;
  db.query(sql)
    .then(result => {
      const leaderList = result.rows;

      for (let ii = 0; ii < leaderList.length; ii++) {
        const currLeader = leaderList[ii];
        const id = currLeader.leaderPkmn;
        let newLeaderInfo = {};

        const sql = `
    SELECT *
    FROM "pokemon"
    WHERE "pokemonId" = $1
  `;
        const params = [id];
        db.query(sql, params)
          .then(result => {
            if (!result.rows[0]) {
              throw new ClientError(400, 'leader pkmn does not exist');
            } else {
              newLeaderInfo = { ...currLeader, leaderPkmn: result.rows[0] };
              fullList.push(newLeaderInfo);
              if (ii === (leaderList.length - 1)) {
                res.json(fullList);
              }
            }
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

// GET: a specific leader's data from the DB

app.get('/api/leader-list/:id', (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    throw new ClientError(400, 'id is required');
  }

  const sql = `
    SELECT *
    FROM "leaders"
    WHERE "leaderId" = $1
  `;
  const params = [id];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(400, 'leader does not exist');
      } else {
        res.status(200).json(result.rows[0]);
      }
    })
    .catch(err => next(err));
});

// GET: get status of a battle for a record ID

app.post('/api/battles/status/:id', (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    throw new ClientError(400, 'id is required');
  }

  const sql = `
    SELECT "result"
    FROM "recordList"
    WHERE "recordId" = $1
  `;
  const params = [id];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(400, 'Something went wrong');
      } else {
        return result.rows[0];
      }
    })
    .then(record => {
      res.status(201).json(record);
    })
    .catch(err => next(err));
});

// POST: create a battle for a record ID

app.post('/api/battles/new', (req, res, next) => {
  const { userId, userPkmn, leaderPkmn, leaderName } = req.body;

  const sql = `
    INSERT INTO "recordList" ("userId", "result", "userPkmn", "leaderPkmn", "leaderName")
    VALUES ($1, 'pending', $2, $3, $4)
    RETURNING "recordId"
  `;
  const params = [userId, userPkmn, leaderPkmn, leaderName];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(400, 'Something went wrong');
      } else {
        return result.rows[0];
      }
    })
    .then(record => {
      res.status(201).json(record);
    })
    .catch(err => next(err));
});

// PATCH: updates the record with the result of the battle

app.patch('/api/battles/result', (req, res, next) => {
  const { recordId, battleResult } = req.body;

  const sql = `
    SELECT * FROM "recordList"
    WHERE "recordId" = $1
  `;
  const params = [recordId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(400, 'record does not exist');
      } else {
        return result.rows[0];
      }
    })
    .then(record => {
      if (record.result !== 'pending') {
        throw new ClientError(400, 'battle has completed already');
      } else {
        const sql = `
          UPDATE "recordList"
          SET "result" = $1
          WHERE "recordId" = $2
          RETURNING *
        `;
        const params = [battleResult, recordId];

        db.query(sql, params)
          .then(result => {
            if (!result.rows[0]) {
              throw new ClientError(400, 'Something went wrong');
            } else {
              return result.rows[0];
            }
          })
          .then(record => {
            res.status(200).json(record);
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
