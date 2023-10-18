
const mongoose = require('mongoose');
const Setting = mongoose.model('Setting', {
    name: String,
    value: String,
    options: { type: Array, default: [] },
});

module.exports = Setting;