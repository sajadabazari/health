const path = require('path');
const HealthCenter = require('../models/HealthCenter');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Province = require('../models/Province');


const index = async (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        const userCount = await User.find().count();
        const adminCount = await User.find({ isAdmin: true }).count();
        const expertCount = await User.find({ $or: [ { userLevelLabel: 'مدیر' }, { userLevelLabel: 'کارشناس ستادی' },{ userLevelLabel: 'کارشناس محیطی' } ] }).count();
        const healthCareCount = await User.find({ userLevelLabel: 'مراقب سلامت' }).count();
        const patientCount = await User.find({ isPatient: true }).count();
        // res.render('panel/index',{login:req.session.user});
        res.render('panel/index', {
            login: req.session.user,
            userCount,
            expertCount,
            adminCount,
            healthCareCount,
            patientCount
        });
    } else if (req.session.user && req.session.user.isPatient == true) {
        const user = await User.findById(req.session.user._id);
        const patient = await Patient.findOne({ user: req.session.user._id });
        if (!patient) {
            const provinces = await Province.find();
            res.render('panel/complete_info', {
                user,
                provinces,
                login: req.session.user,
            });
        } else {
            res.render('panel/index', {
                login: req.session.user,
                user:req.session.user
            });
        }
    } else if (req.session.user && (req.session.user.isPatient == false && req.session.user.isAdmin == false)){
        res.render('panel/index', {
            login: req.session.user,
            user:req.session.user
        });
    }
}
const login = (req, res, next) => {
    res.render('panel/login');
}
const register = (req, res, next) => {
    res.render('panel/register');
}
const forget = (req, res, next) => {
    res.render('panel/forget');
}
const notAccessible = (req, res, next) => {
    res.render('panel/notAccessible');
}
module.exports = {
    index,
    login,
    register,
    forget,
    notAccessible
}