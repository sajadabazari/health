exports.checkAccess = (permissionName) => {
    return (req, res, next) => {
        if (!req.session.user.accessibility[permissionName]) {
            res.render('panel/notAccessible');
        }
        next();
    }
}