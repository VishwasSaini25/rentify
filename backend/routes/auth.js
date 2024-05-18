const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modals/Users');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        role
    });

    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, 'secretkey');
    const role = user.role;
    res.send({ token,role });
});

module.exports = router;
