const express = require('express');
const router = express.Router();
const healthCenterController = require('../controllers/healthCenterController');
const { isAuth } = require('../middlewares/loginAuth');


router.post('/panel/hcenters/count',isAuth(), healthCenterController.getCount);
router.post('/panel/hcenters/getCities', healthCenterController.getCities);
router.post('/panel/hcenters/getHCenters', healthCenterController.getHCenters);
router.post('/panel/hcenters/getVillages', healthCenterController.getVillages);
router.post('/panel/hcenters/regHCenter',isAuth(), healthCenterController.regHCenter);
router.get('/panel/healthcenters/:page?',isAuth(), healthCenterController.index);
router.get('/panel/hcenter/villages/:id',isAuth(), healthCenterController.villages);
router.post('/panel/hcenter/regVillage',isAuth(), healthCenterController.regVillage);
router.delete('/panel/hcenter/village/delete',isAuth(), healthCenterController.deleteVillage);
router.delete('/panel/hcenter/delete',isAuth(), healthCenterController.deleteHCenter);
router.put('/panel/hcenter/village/edit',isAuth(), healthCenterController.updateVillage);
router.put('/panel/hcenter/edit',isAuth(), healthCenterController.updateHCenter);
router.post('/panel/hcenters/create',isAuth(), healthCenterController.create);
router.post('/panel/hcenters/edit',isAuth(), healthCenterController.edit);
router.get('/panel/hcenters/search/:input?',isAuth(), healthCenterController.search);

module.exports = router;