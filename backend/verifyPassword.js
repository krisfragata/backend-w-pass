const supabase = require('./db');
const bcrypt = require('bcrypt');

function serverMessage() {
    this.message = '';
}

serverMessage.prototype.newMessage = function(message){
    this.message = message;
}

const message = new serverMessage();

async function verifyPassword(req, res, next) {
    try{
        const { password } = req.body;
        if (!password) {
            message.newMessage('password is required')
            return res.status(400).json(message);
        }
        const {data, error} = await supabase
            .from('passwords')
            .select('hashed_password')
            .single();

        if (error) {
            throw error;
        }
        if (!data) {
            message.newMessage('no passwords found')
            return res.status(404).json(message)
        }

        const hashedPassword = data.hashed_password;
        console.log(hashedPassword);
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            message.newMessage('invalid password')
            return res.status(401).json(message);
        }
        next();

    } catch(error){
        next(error);
    }
}

module.exports = verifyPassword;