const { Router } = require('express')
const Blurb = require('../models/blurb')
const auth = require('../midleware/auth')
const Coords=require('../models/coords')
const router = Router();
const uuid=require('uuid/v4')
router.get('/', auth, (req, res) => {
    res.render('add', {
        layout:'addLayout',
        isAdd: true,
        title: 'Добавить объявление'
    })
})
router.post('/', auth, async (req, res) => {


    const photoURL = req.files.map(item => {
        return {
            path: item.path
        }
    })

    let { conditioner, washMachine, internet, furniture, registration, tv, microwaveOven } = req.body;
    if (conditioner) conditioner = 'Да'
    if (washMachine) washMachine = 'Да'
    if (internet) internet = 'Да'
    if (furniture) furniture = 'Да'
    if (registration) registration = 'Да'
    if (tv) tv = 'Да'
    if (microwaveOven) microwaveOven = 'Да'
    let ID=uuid()
    ID=ID.toString()
    const blurb = new Blurb({
        ID,
        photoURL,
        region: req.body.region,
        refPoint: req.body.refPoint,
        room: req.body.room,
        conditioner,
        washMachine,
        internet,
        furniture,
        tv,
        microwaveOven,
        typePlanLavatory: req.body.typePlanLavatory,
        typePlanRooms: req.body.typePlanRooms,
        floor: req.body.floor,
        numberOfStoreys: req.body.numberOfStoreys,
        cost: req.body.cost,
        currency: req.body.currency,
        name: req.body.name,
        telephone: req.body.telephone,
        isStudent: req.body.isStudent,
        commission: req.body.commission,
        registration,
        additionalInfo: req.body.additionalInfo,
        userID: req.session.user._id
    })
    let coord={}
    if(req.body.latitude&req.body.longitude)
    {    coord=new Coords({
        ID,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        hintContent:[
            `<p>Цена:${req.body.cost} ${req.body.currency}      </p>`,
            `<p>${req.body.room}/${req.body.floor}/${req.body.numberOfStoreys}</p>`,
            `<p><a class="customColor" href="/blurbs/blurb/${ID}" target="_blanc">Подробнее</a></p>`
        ].join(' ')
        })
    }
    try {
        await blurb.save();
        if(req.body.latitude&req.body.longitude){
            await coord.save();
        }
        res.redirect('/blurbs/1')
    } catch (error) {
        console.log(error);
    }
    
    res.status(200).redirect('/')
})
module.exports = router;