const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const path=require('path')
const flash=require('connect-flash')
const session=require('express-session')
const MongoStore=require('connect-mongodb-session')(session)
const varMiddleware=require('./midleware/variebles')
const helmet=require('helmet')
const compression=require('compression')

const indexRouts = require('./routes/indexRoutes')
const blurbsRouts = require('./routes/blurbs');
const addRouts = require('./routes/add')
const authRouts=require('./routes/auth')
const mapRouts=require('./routes/map')

const fileMiddleware=require('./midleware/file')
const keys=require('./keys')
const PORT = process.env.PORT || 3000;
const app = express();

const store=new MongoStore({
    collection:'sessions',
    uri:keys.MONGODB_URI
})
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images',express.static(path.join(__dirname, 'images')))
app.use('/mapImg',express.static(path.join(__dirname, 'mapImg')))
app.use(fileMiddleware.array('photoURL'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret:keys.SESSION_SECRET,
    resave:true,
    saveUninitialized:false,
    store:store,
    unset:'destroy'
}))
app.use(flash())
app.use(varMiddleware)
app.use(helmet())
app.use(compression())

app.use('/', indexRouts);
app.use('/add', addRouts)
app.use('/blurbs', blurbsRouts)
app.use('/auth',authRouts);
app.use('/map',mapRouts)

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();


