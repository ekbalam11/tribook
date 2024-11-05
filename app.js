const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
dotenv.config()

//public routes
const indexRoutes = require('./routes/index.js');
//admin routes
const adminRoutes = require('./routes/admin.js');
//auto routes
const authRoutes = require('./routes/auth.js');
//rest api routes
const apiRoutes = require('./routes/api.js')

//Express server instance
const app = express();

//Middleware to process post requests with Express for FORMS
app.use(express.urlencoded({ extended: true }));

app.use(flash())

//Session config
app.use(session({
    secret: 'miSecretoSuperSecreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } //secure: true in production with HTTPS
}))

app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin; 
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.user = req.session.user;
    next();
 });

//Moddleware for the get requests to be public
app.use(express.static('public'));

//EJS as template engine
app.set('view engine', 'ejs');

//Middleware morgan for client requests
app.use(morgan('tiny'));

//Middleware to protect admin routes
app.use('/admin', (req, res, next) => {
    if (req.session.isAuthenticated){
        res.locals.isAdmin = true;
        next()
    } else {
        res.redirect('/login')
}
})

//routes 
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use('/api', apiRoutes)


//Mongoose connection:
async function connectDB() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to the database');
};
connectDB().catch(err => console.log(err));

//Cloudinary config
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;


//Server init
const PORT = process.env.PORT || 4000;

app.listen(PORT, (req, res) => {
    console.log("Server listening correctly in port: " + PORT);
    
})
