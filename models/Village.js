const mongoose = require('mongoose');
const Village = mongoose.model('Village', {
    id: String,
    name: String,
    hcenter : { type: mongoose.Schema.Types.ObjectId, ref: 'HealthCenter' },

});

module.exports = Village;

