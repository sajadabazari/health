const mongoose = require('mongoose');
const Report = mongoose.model('Report', {
    user: String,
    fileName: String,
    reportType: String,
    reportDirection: String,
    filePath: String,
    createdAt: Date
});

module.exports = Report;