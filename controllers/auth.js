const keys = require('../keys')
const client = require('twilio')(keys.TWILIO_SID, keys.TWILIO_TOKEN);
const bcrypt = require('bcryptjs');
const User = require('../models/User')

module.exports.register = async function(req,res){
    
    try {
        const { name, tNumber, password, repeatPassword } = req.body;
        const candidate = await User.findOne({ tNumber })

        if (password !== repeatPassword) {
            req.flash('regError', 'Пароли не совпадают')
            return res.status(422).redirect('/auth/login#registration')
        }

        if (candidate) {
            req.flash('regError', 'Пользователь с таким номером уже существует')
            res.redirect('/auth/login#registration')
        }
        else {
            const user = { name, tNumber, password };
            await client.verify.services.create({ friendlyName: 'yourhome.uz' })

            await client.verify.services(keys.TWILIO_VERIFY_SID)
                .verifications
                .create({ to: tNumber, channel: 'sms' })

            res.render('auth/verify', {
                title: 'Подтверждение телефонного номера',
                user
            })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.verifyPhoneNumber = async function(req,res){
    
    try {
        const { name, tNumber, password, verifyCode } = req.body

        let verification_check = await client.verify.services(keys.TWILIO_VERIFY_SID)
            .verificationChecks.create({ to: tNumber, code: verifyCode })

        if (verification_check.valid) {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({ name, tNumber, password: hashPassword })
            await user.save();
            req.flash('Correct', 'Аккаунт успешно создан')
            res.redirect('/auth/login#login')
        }
        else {
            req.flash('Incorrect', 'Введен неправильный код')
            res.redirect('/auth/login#registration')
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.getLoginPage = function(req,res){
    res.render('auth/login', {
        isLogin: true,
        title: 'Авторизация',
        loginError: req.flash('loginError'),
        regError: req.flash('regError'),
        Correct: req.flash('Correct'),
        Incorrect: req.flash('Incorrect')
    })
}


module.exports.login = async function(req,res){
    
    try {
        const { tNumber, password } = req.body
        const candidate = await User.findOne({ tNumber })

        if (candidate) {
            const isValid = await bcrypt.compare(password, candidate.password)
            if (isValid) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err
                    } else {
                        res.redirect('/');
                    }
                })
            } else {
                req.flash('loginError', 'Введен неправильный пароль')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Пользователь с таким номером не сущесвует')
            res.redirect('/auth/login')
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.logout = async function(req,res){
    
    if (req.session) {
        try {
            await req.session.destroy(() => {
                req.session = null;
                req.sessionID = null;
            })
        } catch (error) {
            console.log(error);
        }
    }
    res.redirect('/')
}