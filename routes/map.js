const {Router}=require('express')
const Coords=require('../models/coords')

const router=Router()

router.get('/getCoords',async(req,res)=>{
const coords=await Coords.find()
    res.json(coords)
})
router.get('/blurbs', (req, res) => {
    res.render('map', {
        layout: 'mapLayout',
    })
})
module.exports=router