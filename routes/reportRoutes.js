const express = require('express');
const router = express.Router();
const moment = require('jalali-moment');
const { checkAccess } = require('../middlewares/checkAccess');
const reportController = require('../controllers/reportController');
const { isAuth } = require('../middlewares/loginAuth');
router.get('/panel/reports/:page?',isAuth(true),checkAccess('getReport'), reportController.reports);
router.get('/panel/getReport',isAuth(true),checkAccess('getReport'), reportController.reportAllInfo);
router.post('/panel/getReport',isAuth(true),checkAccess('getReport'), reportController.getReport);
router.get('/panel/report/delete/:id',isAuth(true),checkAccess('getReport'), reportController.deleteReport);
router.get('/panel/rep',isAuth(true),checkAccess('getReport'), reportController.rep);
router.get('/panel/repp',isAuth(true),checkAccess('getReport'), reportController.repp);
router.get('/panel/uInfoReport',isAuth(true),checkAccess('getReport'), reportController.uInfoReport);


router.get('/panel/chart',isAuth(true),checkAccess('getReport'), reportController.chart);
router.post('/panel/chart/getChartInfo',checkAccess('getReport'), reportController.getChartInfo);



router.get('/panel/report/patient/:_id?',isAuth(true),checkAccess('getReport'), reportController.patientReport);
router.post('/panel/report/getReportPatient',isAuth(true),checkAccess('getReport'), reportController.getReportPatient);
router.get('/panel/sss', reportController.getReportPatient);





router.get('/panel/report/testReport', reportController.testReport);
router.post('/panel/report/testAdvanced', reportController.testAdvanced);










router.get('/panel/testDate',(req,res)=>{

  //  let jalali = jalali("2022/07/09","YYYY/MM/DD'").locale('fa').format('YYYY/MM/DD');

 //   console.log(jalali("1396/01/04","YYYY/MM/DD'").locale('en').format('YYYY/MM/DD'))
   // console.log(moment.from('1392/6/3', 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')); 
    //moment('2013-8-25 16:40:00').locale('fa').format('YYYY/M/D'); // 1392/6/31 23:59:59
});
module.exports = router;