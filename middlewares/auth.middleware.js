const jwt =  require('jsonwebtoken');
const User = require('../models/User');
const auth = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if(!authorization) {
        return res.status(400).json({ message: 'Authorization must be required' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } =  jwt.verify(token, process.env.SECRET_JWT_KEY)

        const user = await User.findById(id);

        if(!user) {
            return res.status(400).json({ message: 'Not authorized' })
        }

        req.user = user; 

        next();
    } catch (err) {
        return res.status(500).json({ message: err.message })        
    }
}

module.exports = auth;