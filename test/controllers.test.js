const assert = require('node:assert/strict');
const test = require('node:test');
const register = require('../controllers/register');
const signin = require('../controllers/signin');

const createResponse = () => ({
    statusCode: 200,
    body: undefined,
    status(code) {
        this.statusCode = code;
        return this;
    },
    json(body) {
        this.body = body;
        return this;
    }
});

test('register hashes the password and returns the created user', async () => {
    const createdUser = { id: 1, name: 'Conner', email: 'conner@example.com' };
    const trx = table => {
        assert.equal(table, 'users');
        return {
            returning: columns => {
                assert.equal(columns, '*');
                return {
                    insert: async user => {
                        assert.equal(user.email, 'conner@example.com');
                        return [createdUser];
                    }
                };
            }
        };
    };
    trx.insert = login => ({
        into: table => {
            assert.equal(table, 'login');
            assert.equal(login.hash, 'secure-hash');
            return {
                returning: async column => {
                    assert.equal(column, 'email');
                    return [{ email: login.email }];
                }
            };
        }
    });

    const db = { transaction: callback => callback(trx) };
    const bcrypt = {
        hash: async (password, rounds) => {
            assert.equal(password, 'correct horse battery staple');
            assert.equal(rounds, 12);
            return 'secure-hash';
        }
    };
    const req = {
        body: {
            name: 'Conner',
            email: 'conner@example.com',
            password: 'correct horse battery staple'
        }
    };
    const res = createResponse();

    await register.handleRegister(req, res, db, bcrypt);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, createdUser);
});

test('signin compares the password asynchronously and returns the user', async () => {
    const user = { id: 1, email: 'conner@example.com' };
    const db = {
        select: () => ({
            from: table => ({
                where: () => ({
                    first: async () => table === 'login'
                        ? { email: user.email, hash: 'stored-hash' }
                        : user
                })
            })
        })
    };
    const bcrypt = {
        compare: async (password, hash) => {
            assert.equal(password, 'secret');
            assert.equal(hash, 'stored-hash');
            return true;
        }
    };
    const req = { body: { email: user.email, password: 'secret' } };
    const res = createResponse();

    await signin.handleSignin(req, res, db, bcrypt);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, user);
});

test('signin rejects invalid credentials', async () => {
    const db = {
        select: () => ({
            from: () => ({
                where: () => ({
                    first: async () => ({ email: 'conner@example.com', hash: 'stored-hash' })
                })
            })
        })
    };
    const bcrypt = { compare: async () => false };
    const req = { body: { email: 'conner@example.com', password: 'wrong' } };
    const res = createResponse();

    await signin.handleSignin(req, res, db, bcrypt);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body, 'wrong credentials');
});
