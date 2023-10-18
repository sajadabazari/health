const mongoose = require('mongoose');
const Province = mongoose.model('Province', {
    id: String,
    name: String,
});

module.exports = Province;

