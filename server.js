const bcrypt = require('bcrypt');
const knex = require('knex');
const { createApp } = require('./app');

// Connect to postgresql db using knex
const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
});

const app = createApp({ db, bcrypt });
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Listening on port:', PORT);
});

/* Start with API template

/ res                = this is working
/signin POST         = success/fail
/register POST       = user
/profile/:userId GET = user
/image PUT           = user

*/
