const bcrypt = require('bcrypt');
const supabase = require('./db')
async function verifyPassword(req, res, next) {
    try {
        const {password} = req.body;
        if (!password) {
            return res.status(400).send('password is required');
        }

        const {data, error} = await supabase
            .from('passwords')
            .select('hashed_password')
            .single();
        if (error) {
            throw error;
        }
        if (!data) {
            return res.status(404).send('password not found');
        }

        const hashedPassword = data.hashed_password;

        const isMatch = await bcrypt.compare(password, hashedPassword);
        if(!isMatch) {
            return res.status(401).send('invalid password');
        }
        next();
    } catch(error) {
        next(error);
    }
}

module.exports = verifyPassword;