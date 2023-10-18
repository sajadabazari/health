const express = require("express");
const router = express.Router();
const patientAuth = require("../../middlewares/patientAuth");
const Patient = require("../../models/Patient");
const patientUserController = require("../../controllers/patientUserController");

///patient Routes
router.get('/panel/patient', patientAuth, async (req, res, next) => {

    const patient = await Patient.findOne({ user: req.session.user._id });
    if (!patient) {
        res.render('panel/patient/complete_info', {
            login: req.session.user._id
        });
    }
    res.render('panel/patient/index', {
        login: req.session.user._id
    });
});

router.post('/panel/patient/regDetails',patientAuth, patientUserController.regDetails);
router.get('/panel/puser/e_crfs',patientAuth, patientUserController.e_crfs);
router.get('/panel/puser/e_crf/create',patientAuth, patientUserController.e_crf_create);
router.get('/panel/puser/e_crf/edit/:crfId',patientAuth, patientUserController.e_crf_edit);
router.post('/panel/puser/e_crf/create',patientAuth, patientUserController.crfCreate);
router.post('/panel/puser/e_crf/edit',patientAuth, patientUserController.crfEdit);


module.exports = router;