const mongoose = require('mongoose');
const City = mongoose.model('City', {
    id: String,
    province : { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
    name: String,
});

module.exports = City;