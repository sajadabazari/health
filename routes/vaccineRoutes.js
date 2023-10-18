const express = require('express');
const { isAuth } = require('../middlewares/loginAuth');
const vaccineController = require('../controllers/vaccineController');
const router = express.Router();

router.get('/panel/vaccines', isAuth(), vaccineController.vaccines);
router.post('/panel/vaccine/create', isAuth(), vaccineController.createVaccine);
router.post('/panel/vaccine/edit', isAuth(), vaccineController.editVaccine);
router.get('/panel/vaccine/delete/:_id', isAuth(), vaccineController.deleteVaccine);



module.exports = router;