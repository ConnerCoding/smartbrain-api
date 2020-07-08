const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');
const register = require('./controllers/register');
const signin = require('./controllers/signin');

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
const PORT = 3000;
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'Sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => { signin.signin(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select().from('users').where({
        id: id
    })
    .then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('user not found');
        }
    })
    .catch (err => {
        res.status(400).json('error getting user');
    })
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => {
        res.status(400).json('unable to get entries');
    })
})

// bcrypt.hash("cookies", null, null, function(err, hash) {
//     console.log(hash);
// });

// // Load hash from your password DB.
// bcrypt.compare("cookies", "$2a$10$XDQNwRgoQRo1n4u3xU/EMOqvIRnVGTPMYipcQ7VxHMZL3Uf2h2pTm", function(err, res) {
//     console.log(res);
// });
// bcrypt.compare("veggies", "$2a$10$XDQNwRgoQRo1n4u3xU/EMOqvIRnVGTPMYipcQ7VxHMZL3Uf2h2pTm", function(err, res) {
//     console.log(res);
// });

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
