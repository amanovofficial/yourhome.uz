const controllers = require('../controllers/auth');
const { Router } = require('express');
const router = Router();


router.post('/registration', controllers.register)

router.post('/verify', controllers.verifyPhoneNumber)

router.get('/login', controllers.getLoginPage)

router.post('/login', controllers.login)

router.get('/logout', controllers.logout)

module.exports = router