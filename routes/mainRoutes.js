
const express = require('express');
const router = express.Router();
const moment = require('moment');
const mainController = require('../controllers/mainController');
const { isAuth } = require('../middlewares/loginAuth');
const Patient = require('../models/Patient');
const User = require('../models/User');

//──── GET Http Methods ─────────────────────────────────────────────────────────────────
//GET /mainController/index

router.get('/', (req, res, next) => {
    //console.log(moment().format('dddd'));
    //res.render('index')
    res.redirect('/panel/login');
});
router.get('/panel', isAuth(true), mainController.index);
router.get('/panel/login', mainController.login);
router.get('/panel/register', mainController.register);
router.get('/panel/forget', mainController.forget);

router.get('/panel/notAccessible', mainController.notAccessible);
router.get('/panel/n', async () => {
   const patients = await Patient.aggregate([
        {
            $match: {
                "e_crf.sideEffectDate": {
                    $gte: new Date('2021/01/01'),
                    $lt: new Date('2023/01/01')
                }
            }
        },
        { $unwind: '$e_crf' }
    ]);
console.log(patients)
});






module.exports = router;
