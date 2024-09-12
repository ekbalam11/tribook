// importar módulos de terceros
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session')

//método para cargar variables de entorno
const dotenv = require('dotenv');
dotenv.config();
//console.log(process.env) // remove this after you've confirmed it is working

// Importar rutas públicas
const indexRoutes = require('./routes/index.js');

// Importar las rutas de administrador
const adminRoutes = require('./routes/admin.js');

// Crear rutas de autentificación
const authRoutes = require('./routes/auth.js');

// creamos una instancia del servidor Express
const app = express();

// Tenemos que usar un nuevo middleware para indicar a Express que queremos procesar peticiones de tipo POST
app.use(express.urlencoded({ extended: true }));

//Configurar sesión
app.use(session({
    secret: 'miSecretoSuperSecreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } //secure: true en producción con HTTPS
}))

app.use((req, res, next) => {
    //La variable req.locals es una variable "global" de tipo objeto a la que todas las vistas pueden acceder
    res.locals.isAdmin = req.session.isAuthenticated; //Por defecto no soy usuario admin.

    // Tenemos que ejecutar next() para que la petición HTTP siga su curso
    next();
 })

// Añadimos el middleware necesario para que el client puedo hacer peticiones GET a los recursos públicos de la carpeta 'public'
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Especificar a Express que quiero usar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Usamos el middleware morgan para loguear las peticiones del cliente
app.use(morgan('tiny'));

// Añadimos las rutas de Index.js en nuestra app
// El primer parámetro significa que todas las rutas que se encuentren en 'indexRouter' estarán prefijados por '/'

//Middleware para proteger las rutas de administrador
app.use('/admin', (req, res, next) => { //Miramos si el usuario está autentificado
    if (req.session.isAuthenticated){
        res.locals.isAdmin = true; //Si es que si, establecemos que es de tipo admin
        next()
    } else { //En caso contrario, lo llevamos a la vista de login
        res.redirect('/login')
    }
})


app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use(authRoutes); //'./routes/auth.js'

async function connectDB() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a la base de datos');
}

connectDB().catch(err => console.log(err))

app.listen(PORT, (req, res) => {
    console.log("Servidor escuchando correctamente en el puerto " + PORT);
});
