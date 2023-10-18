const { body } = require('express-validator');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuth } = require('../middlewares/loginAuth');
router.post('/panel/loginUser',
    [
        body('nationalCode')
            .trim()
            .not()
            .isEmpty().withMessage('Password is required.'),
        body('password')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Password is required.')
    ],
    userController.loginUser
);

router.post('/panel/user/register',userController.userRegister);
router.get('/panel/signOut',userController.signOut);

router.get('/panel/users/:page?',isAuth(), userController.users);
router.get('/panel/user/create/:patient?',isAuth(), userController.create);
router.post('/panel/user/create',isAuth(), userController.createUser);
router.post('/panel/user/update',isAuth(), userController.update);
router.post('/panel/user/changePassword',isAuth(), userController.changePassword);
router.get('/panel/user/edit/:_id/:patient?', isAuth(),userController.edit);
router.get('/panel/user/deleteUser/:id', isAuth(),userController.deleteUser);
router.get('/panel/user/search/:input?',isAuth(), userController.search);

router.post('/panel/checkUserExist', userController.checkUserExist);
router.post('/sendForgetEmail', userController.sendForgetEmail);


module.exports = router;