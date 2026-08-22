// Receive form input from user - input name and email
// into DB. Use bcrypt to hash and store password
// Respond to front end with the user
const handleRegister = async (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    try {
        const hash = await bcrypt.hash(password, 12);
        const user = await db.transaction(async trx => {
            const [login] = await trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email');

            const [createdUser] = await trx('users').returning('*').insert({
                name: name,
                email: login.email,
                joined: new Date()
            });

            return createdUser;
        });

        return res.json(user);
    } catch (err) {
        return res.status(400).json('unable to register');
    }
}

module.exports = {
    handleRegister: handleRegister
}
