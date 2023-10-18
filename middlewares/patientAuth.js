const patientAuth = (req, res, next) => {
    if (!req.session.user) {
        let error = new Error('Not authenticated.');
        error.statusCode = 401;
        error.message = 'notLogin';
        throw error;
    }
    next();
}
module.exports = patientAuth;

