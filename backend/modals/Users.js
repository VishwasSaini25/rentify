const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phoneNumber: String,
    password: String,
    role: { type: String, enum: ['seller', 'buyer'] }
});

module.exports = mongoose.model('User', UserSchema);
