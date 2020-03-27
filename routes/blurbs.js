const Blurb = require("../models/blurb");

const { Router } = require('express');
const router = Router();
const auth = require('../midleware/auth')
const fs = require('fs')
const Coords=require('../models/coords')

router.get('/:page', async (req, res) => {

    try {
        let perPage = 5
        let page = req.params.page || 1
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

            const BLURBS = await Blurb.paginate(query, options)
            const blurbs = BLURBS.docs.map(item => {
                return item._doc
            })
            if (blurbs.length > 0) {
                notFound = false;
            }
            res.render('blurbs', {
                blurbs,
                current: page,
                totalPages: BLURBS.totalPages,
                prev: BLURBS.prevPage,
                next: BLURBS.nextPage,
                isBlurbs: true,
                title: 'Объвления',
                searchQuery: req.query.search,
                notFound
            })
        } else {
            const BLURBS = await Blurb.paginate({}, options)
            const blurbs = BLURBS.docs.map(item => {
                return item._doc
            })
            res.render('blurbs', {
                blurbs,
                current: page,
                totalPages: BLURBS.totalPages,
                prev: BLURBS.prevPage,
                next: BLURBS.nextPage,
                isBlurbs: true,
                title: 'Объвления',
            })
        }
    } catch (error) {
        console.log(error);
    }

});

router.get('/myBlurbs/:page', auth, async (req, res) => {

    try {
        let perPage = 2
        let page = req.params.page || 1
        const options = {
            page,
            sort: { date: -1 },
            limit: perPage,
            collation: {
                locale: 'en'
            }
        };

        const query = {
            userID: `${req.session.user._id}`
        }

        const BLURBS = await Blurb.paginate(query, options)
        const myBlurbs = BLURBS.docs.map(item => {
            return item._doc
        })

        res.render('myBlurbs', {
            title: 'Мои объвления',
            isMyBlurbs: true,
            myBlurbs,
            current: page,
            totalPages: BLURBS.totalPages,
            prev: BLURBS.prevPage,
            next: BLURBS.nextPage,
        })
    } catch (error) {
        console.log(error);
    }

})
router.get('/blurb/:ID', async (req, res) => {

    try {
        const BLURB = await Blurb.findOne({ "ID": req.params.ID });

        let i = -1;

        if (BLURB.photoURL) {
            const photoURL = BLURB.photoURL.map(item => {
                i++
                if (i == 0) {
                    return {
                        firstPhoto: item.path,
                        firstPhotoNumber: i
                    }
                }
                return {
                    path: item.path,
                    numberOfPhoto: i
                }
            })
            BLURB.photoURL = photoURL;
        }

        res.render('blurb', {
            title: `${BLURB.region} ${BLURB.refPoint}`,
            blurb: BLURB._doc,
        })
    } catch (error) {
        console.log(error);
    }

})

router.post('/remove', auth, async (req, res) => {

    try {
        const blurb = await Blurb.findOne({ "ID": req.body.ID })
        if (!blurb.photoURL) {
            blurb.photoURL.map(item => {
                fs.unlink(item.path, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                })
            })
        }
        await Blurb.deleteOne({ "ID": req.body.ID })
        const coordCandidate=await Coords.findOne({ "ID": req.body.ID })
        if(coordCandidate){
            await Coords.deleteOne({ "ID": req.body.ID })
        }
        res.redirect('/blurbs/myBlurbs/1')
    } catch (error) {
        console.log(error);
    }

})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

module.exports = router;