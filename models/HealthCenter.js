const mongoose = require('mongoose');
const HealthCenter = mongoose.model('HealthCenter', {
    name: String,
    province : { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
    city : { type: mongoose.Schema.Types.ObjectId, ref: 'City' },

});

module.exports = HealthCenter;