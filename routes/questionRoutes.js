const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { isAuth } = require('../middlewares/loginAuth');


router.get('/panel/questions', questionController.index);
router.get('/panel/questions/upload',isAuth(), questionController.upload);
router.post('/panel/questions/update',isAuth(), questionController.update);

router.get('/panel/answers',isAuth(), questionController.answers);
router.post('/panel/answer/update', questionController.answerUpdate);
router.post('/panel/answer/setSeen', questionController.setSeen);


module.exports = router;