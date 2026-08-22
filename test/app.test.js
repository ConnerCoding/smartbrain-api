const assert = require('node:assert/strict');
const test = require('node:test');
const { createApp } = require('../app');

test('GET / reports that the API is running', async t => {
    const app = createApp({ db: {}, bcrypt: {} });
    const server = app.listen(0);

    await new Promise((resolve, reject) => {
        server.once('listening', resolve);
        server.once('error', reject);
    });
    t.after(() => server.close());

    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/`);

    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'It is running');
    assert.equal(response.headers.get('x-powered-by'), null);
});
