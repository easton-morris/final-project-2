require('dotenv/config');
const pg = require('pg');
const express = require('express');
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

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
