const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    place: String,
    area: Number,
    bedrooms: Number,
    bathrooms: Number,
    nearbyHospitals: String,
    nearbyColleges: String,
    interestedBuyers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Property', PropertySchema);
