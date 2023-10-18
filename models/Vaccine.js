const mongoose = require('mongoose');
const Vaccine = mongoose.model('Vaccine', {
    name: String,
});

module.exports = Vaccine;