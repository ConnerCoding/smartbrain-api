const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const pg = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Ww1047171!',
      database : 'smart-brain'
    }
});

console.log(pg.select().from('users'));

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

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json('error');
        }
    res.json('this is working');
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(404).send('user not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).send('user not found');
    }
})

bcrypt.hash("cookies", null, null, function(err, hash) {
    console.log(hash);
});

// Load hash from your password DB.
bcrypt.compare("cookies", "$2a$10$XDQNwRgoQRo1n4u3xU/EMOqvIRnVGTPMYipcQ7VxHMZL3Uf2h2pTm", function(err, res) {
    console.log(res);
});
bcrypt.compare("veggies", "$2a$10$XDQNwRgoQRo1n4u3xU/EMOqvIRnVGTPMYipcQ7VxHMZL3Uf2h2pTm", function(err, res) {
    console.log(res);
});

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
