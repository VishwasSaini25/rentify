const express = require('express');
const Property = require('../modals/Property');
const User = require('../modals/Users');
const jwt = require('jsonwebtoken');

const router = express.Router();

const authenticate = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, 'secretkey');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

router.post('/', authenticate, async (req, res) => {
    const { place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges } = req.body;
    const property = new Property({
        seller: req.user.userId,
        place,
        area,
        bedrooms,
        bathrooms,
        nearbyHospitals,
        nearbyColleges
    });

    try {
        await property.save();
        res.status(201).send('Property posted');
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    const properties = await Property.find().populate('seller', 'firstName lastName');
    res.send(properties);
});

router.get('/my', authenticate, async (req, res) => {
    const properties = await Property.find({ seller: req.user.userId });
    res.send(properties);
});

router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const property = await Property.findByIdAndUpdate(id, req.body, { new: true });
    res.send(property);
});

router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.send('Property deleted');
});

router.post('/:id/interested', authenticate, async (req, res) => {
    const { id } = req.params;
    const property = await Property.findById(id);
    property.interestedBuyers.push(req.user.userId);
    await property.save();
    const seller = await User.findById(property.seller);
    res.send({ seller: { firstName: seller.firstName, lastName: seller.lastName, email: seller.email, phoneNumber: seller.phoneNumber } });
});

router.post('/:id/like', authenticate, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).send('Property not found');
        }
        property.likes += 1;
        await property.save();
        res.send({ likes: property.likes });
    } catch (error) {
        res.status(400).send(error);
    }
});
module.exports = router;
