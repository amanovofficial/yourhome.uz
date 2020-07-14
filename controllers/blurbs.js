const fs = require('fs')
const uuid = require('uuid/v4')
const Blurb = require("../models/blurb");
const Coords = require('../models/coords');
const escapeRegex = require('../utils/escapeRegex')

module.exports.getBlurbCreatePage = function(req,res){
    res.render('blurbCreate', {
        layout: 'blurbCreateLayout',
        isAdd: true,
        title: 'Добавить объявление'
    })
}

module.exports.createBlurb = async function(req,res){
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
    let ID = uuid()
    ID = ID.toString()
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
    let coord = {}
    try {
        if (req.body.latitude & req.body.longitude) {
            coord = new Coords({
                ID,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                hintContent: [
                    `<p>Цена:${req.body.cost} ${req.body.currency}      </p>`,
                    `<p>${req.body.room}/${req.body.floor}/${req.body.numberOfStoreys}</p>`,
                    `<p><a class="customColor" href="/blurbs/detail?ID=${ID}" target="_blanc">Подробнее</a></p>`
                ].join(' ')
            })
            await coord.save();
        }
        await blurb.save();
        res.redirect('/blurbs')
    } catch (error) {
        console.log(error);
    }
}

module.exports.getAll = async function (req, res) {

    try {
        let perPage = 5
        let page = req.query.page || 1
        let notFound = true
        const options = {
            page,
            sort: { date: -1 },
            limit: perPage,
            collation: {
                locale: 'en'
            }
        };
        if (req.query.search !== ' ' && req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi')
            const query = {
                $or: [
                    { region: regex },
                    { refPoint: regex },
                    { additionalInfo: regex }
                ]
            }

            const blurbs = await Blurb.paginate(query, options)
            
            if (blurbs.docs.length > 0) {
                notFound = false;
            }
           
            res.render('blurbs', {
                blurbs:blurbs.docs,
                current: page,
                totalPages: blurbs.totalPages,
                prev: blurbs.prevPage,
                next: blurbs.nextPage,
                isBlurbs: true,
                title: 'Объвления',
                searchQuery: req.query.search,
                notFound
            })
        } else {
            const blurbs = await Blurb.paginate({}, options)
            if(req.query.asynchronicQuery){
                const coords = await Coords.find()
              return  res.json(coords)
            }else{
                res.render('blurbs', {
                    blurbs:blurbs.docs,
                    current: page,
                    totalPages: blurbs.totalPages,
                    prev: blurbs.prevPage,
                    next: blurbs.nextPage,
                    isBlurbs: true,
                    title: 'Объвления',
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.getBlurbsOnMap = function(req,res){
    res.render('map', {
        layout: 'mapLayout',
    })
}

module.exports.getMyBlurbs = async function (req, res) {

    try {
        let perPage = 1
        let page = req.query.page || 1
        const options = {
            page,
            sort: { date: -1 },
            limit: perPage,
            collation: {
                locale: 'en'
            }
        };

        const query = {
            userID: req.session.user._id
        }

        const myBlurbs = await Blurb.paginate(query, options)
        
        res.render('myBlurbs', {
            title: 'Мои объвления',
            isMyBlurbs: true,
            myBlurbs:myBlurbs.docs,
            current: page,
            totalPages: myBlurbs.totalPages,
            prev: myBlurbs.prevPage,
            next: myBlurbs.nextPage,
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports.getById = async function (req, res) {

    try {
        const blurb = await Blurb.findOne({ "ID": req.query.ID });

        let i = -1;

        if (blurb.photoURL.length > 0) {
            const photoURL = blurb.photoURL.map(item => {
                i++
                if (i == 0) {
                    return {
                        firstPhoto: item.path,
                        firstPhotoNumber: i
                    }
                } else {
                    return {
                        path: item.path,
                        numberOfPhoto: i
                    }
                }
            })
            blurb.photoURL = photoURL;
        }

        res.render('blurb', {
            title: `${blurb.region} ${blurb.refPoint}`,
            blurb: blurb._doc,
        })
    } catch (error) {
        console.log(error);
    }

}


module.exports.remove = async function (req, res) {
    try {
        const blurb = await Blurb.findOne({ "ID": req.params.ID })
        if (blurb.photoURL.length>0) {
            blurb.photoURL.map(item => {
                fs.unlink(item.path, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                })
            })
        }
        await Blurb.deleteOne({ "ID": req.params.ID })
        const coordCandidate = await Coords.findOne({ "ID": req.params.ID })
        if (coordCandidate) {
            await Coords.deleteOne({ "ID": req.params.ID })
        }
        res.redirect('/blurbs/myBlurbs?page=1')
    } catch (error) {
        console.log(error);
    }
}