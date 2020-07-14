const controllers = require('../controllers/index')
const {Router}=require('express')
const router=Router();

router.get('/',controllers.getIndexPage)

module.exports=router