const express = require('express');
const { isAuth } = require('../middlewares/loginAuth');
const Patient = require('../models/Patient');
const patientController = require('../controllers/patientController');
const { checkAccess } = require('../middlewares/checkAccess');
const router = express.Router();

///admin Routes
router.get('/panel/patients/:page?',isAuth(true), patientController.patients);
router.post('/panel/patient/set_history',isAuth(true),checkAccess('editHistory'), patientController.set_history);

router.delete('/panel/patient/delete/:id',isAuth(true), checkAccess('deletePatient'),patientController.deletePatient);

router.get('/panel/patient/e_crfs', isAuth(true),patientController.e_crfs_patient);
router.get('/panel/patient/e_crfs/:_id',isAuth(true), checkAccess('ptnSideEffect'), patientController.e_crfs);
router.get('/panel/patient/e_crf/create/:_id',isAuth(true), checkAccess('ptnSideEffect'), patientController.e_crf_create);
router.get('/panel/patient/p/e_crf/create/:_id',isAuth(true), patientController.patient_e_crf_create);
router.post('/panel/patient/e_crf/create',isAuth(true), patientController.crfCreate);
//router.post('/panel/patient/e_crf/create',isAuth(true), checkAccess('ptnSideEffect'), patientController.crfCreate);
router.get('/panel/patient/e_crf/edit/:crfId',isAuth(true), checkAccess('editSideEffect'), patientController.e_crf_edit);
router.get('/panel/patient/p/e_crf/edit/:crfId',isAuth(true), patientController.patient_e_crf_edit);
router.post('/panel/patient/e_crf/edit',isAuth(true), patientController.crfEdit);
//router.post('/panel/patient/e_crf/edit',isAuth(true), checkAccess('editSideEffect'), patientController.crfEdit);
router.get('/panel/patient/e_crf/delete/:crfId',isAuth(true), patientController.deleteCrf);
//router.get('/panel/patient/e_crf/delete/:crfId',isAuth(true), checkAccess('deleteSideEffect'), patientController.deleteCrf);
router.get('/panel/patient/insert',isAuth(true), checkAccess('ptnRegister'), patientController.insert);
router.get('/panel/patient/create', isAuth(true), checkAccess('ptnRegister'),patientController.create);
router.get('/panel/patient/edit/:_id',isAuth(true), checkAccess('ptnRegister'), patientController.edit);
router.post('/panel/patient/create', isAuth(true), checkAccess('ptnRegister'),patientController.regPatient);
router.get('/panel/patient/search/:input?',isAuth(), patientController.search);
router.post('/panel/patient/find',isAuth(true),patientController.findPatient);
router.post('/panel/patient/checkVaccineDoseExist', patientController.checkVaccineDoseExist);




module.exports = router;
