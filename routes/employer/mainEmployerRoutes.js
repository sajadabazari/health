const express = require('express');
const router = express.Router();
const patientEmployerController = require('../../controllers/employer/patientEmployerController');
const { checkAccess } = require('../../middlewares/checkAccess');
const { isAuth } = require('../../middlewares/loginAuth');

router.get('/panel/em/patients/:page?', isAuth(true), patientEmployerController.patients)
router.get('/panel/em/patient/create', isAuth(true), checkAccess('ptnRegister'), patientEmployerController.create)
router.get('/panel/em/patient/edit/:_id', isAuth(true), checkAccess('ptnRegister'), patientEmployerController.edit)
router.get('/panel/em/patient/delete/:id', isAuth(true), checkAccess('deletePatient'), patientEmployerController.deleteUser)
router.get('/panel/em/patient/search/:input?', isAuth(true), checkAccess('ptnSearch'), patientEmployerController.search)
router.get('/panel/em/patient/e_crfs/:userId', isAuth(true), checkAccess('ptnSideEffect'), patientEmployerController.e_crfs);
router.get('/panel/em/patient/e_crf/create/:userId', isAuth(true), checkAccess('ptnSideEffect'), patientEmployerController.e_crf_create);
router.post('/panel/em/patient/e_crf/create', checkAccess('ptnSideEffect'), patientEmployerController.crfCreate);
router.get('/panel/em/patient/e_crf/edit/:crfId', isAuth(true), checkAccess('editSideEffect'), patientEmployerController.e_crf_edit);
router.get('/panel/em/patient/e_crf/delete/:crfId', isAuth(true), checkAccess('deleteSideEffect'), patientEmployerController.deleteCrf);

router.post('/panel/em/patient/e_crf/edit', checkAccess('editSideEffect'), patientEmployerController.crfEdit);
router.post('/panel/em/patient/create', checkAccess('ptnRegister'), patientEmployerController.ptnCreate)
router.post('/panel/em/patient/edit',checkAccess('ptnRegister'), patientEmployerController.ptnEdit)
router.post('/panel/em/patient/set_history', checkAccess('ptnSideEffect'), patientEmployerController.set_history);

module.exports = router;