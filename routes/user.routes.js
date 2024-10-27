const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');
const passwordHashed = require('password-hash');
const User = require('../models/User');

// middlewares
const auth = require('../middlewares/auth.middleware');

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_JWT_KEY);
}

// Create
router.post('/create-admin', async (req, res) => {
    try {
        const { email, password, secretInput } = req.body;

        if(!secretInput || secretInput !== 'moones') {
            return res.status(400).json({ message: "Sorry!" })
        }

        if(!email || !password) {
            return res.status(400).json({ message: "All data must be required" })
        }

        if(typeof email !== 'string') {
            return res.status(400).json({ message: "Email must be string" })
        }

        if(typeof password !== 'string') {
            return res.status(400).json({ message: "Password must be string" })
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }

        const hashed = passwordHashed.generate(password);

        let admin = await User.findOne({ role: 'admin' })

        if(admin) {
            const isUniqueEmail = await User.findOne({email, _id: { $ne: admin._id }});

            if(isUniqueEmail) {
                return res.status(400).json({ message: "This email already exist" })
            }
            
            admin.email = email;
            admin.password = hashed;

            await admin.save();
        } else {
            admin = await User.create({ email, password: hashed, role: 'admin' })
        }

        const data = {
            id: admin._id,
            email: admin.email,
        }

        return res.status(200).json({ messgae: "Created Admin successfully", data})
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

// SignUp
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "All data must be required" })
        }

        if(typeof email !== 'string') {
            return res.status(400).json({ message: "Email must be string" })
        }

        if(typeof password !== 'string') {
            return res.status(400).json({ message: "Password must be string" })
        }

        const isUniqueEmail = await User.findOne({email});

        if(isUniqueEmail) {
            return res.status(400).json({ message: "This email already exist" })
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }

        const hashed = passwordHashed.generate(password);

        const user = await User.create({ email, password: hashed })

        const token = createToken(user.id);

        return res.status(200).json({ message: "Signup in successfully", admin, token })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "All data must be required" })
        }

        if(typeof email !== 'string') {
            return res.status(400).json({ message: "Email must be string" })
        }

        if(typeof password !== 'string') {
            return res.status(400).json({ message: "Password must be string" })
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ message: "Invalid Password & Email" });
        }

        const passwordVerified = passwordHashed.verify(password, user.password);

        if(!passwordVerified) {
            return res.status(400).json({ message: "Invalid Password & Email" })
        }
        
        const token = createToken(user.id);

        const data = {
            _id: user._id,
            email: user.email,
            role: user.role,
        }

        return res.status(200).json({ message: "Logged in successfully", data, token })
    } catch (error) {
        return res.status(500).json({ message: error.message })        
    }
})

// Logout
router.post('/logout', auth, async (req, res) => {
    try {
        return res.status(200).json({ message: "Logged out succesfully", data: req.user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;