const express = require('express');
const cors = require('cors');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const createApp = ({ db, bcrypt }) => {
    const app = express();

    app.disable('x-powered-by');
    app.use(express.json({ limit: '100kb' }));
    app.use(cors());

    app.get('/', (req, res) => res.send('It is running'));
    app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));
    app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
    app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db));
    app.put('/image', (req, res) => image.handleImage(req, res, db));

    return app;
};

module.exports = { createApp };
