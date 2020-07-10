const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Ww1047171!',
      database : 'smart-brain'
    }
});

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('It is running'))
app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt))
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))
app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db))
app.put('/image', (req, res) => image.handleImage(req, res, db))

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
