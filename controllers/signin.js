// Sign in using email and password hash via bcrypt
// If valid, then log in and respond with the user
const handleSignin = async (req, res, db, bcrypt) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    try {
        const login = await db.select('email', 'hash').from('login')
            .where('email', '=', email)
            .first();

        if (!login || !(await bcrypt.compare(password, login.hash))) {
            return res.status(400).json('wrong credentials');
        }

        const user = await db.select().from('users')
            .where('email', '=', email)
            .first();

        return res.json(user);
    } catch (err) {
        return res.status(400).json('wrong credentials');
    }
}

module.exports = { handleSignin };
