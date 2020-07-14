const { Router } = require('express');
const router = Router();
const auth = require('../midleware/auth')
const controllers = require('../controllers/blurbs')

router.get('/create', auth,controllers.getBlurbCreatePage)

router.post('/create', auth, controllers.createBlurb)

router.get('/', controllers.getAll)

router.get('/myBlurbs', auth,controllers.getMyBlurbs)

router.get('/map',controllers.getBlurbsOnMap)

router.get('/detail', controllers.getById)

router.get('/remove/:ID', auth, controllers.remove)

module.exports = router;