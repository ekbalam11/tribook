const User = require('../models/user.model');
const bcrypt = require('bcryptjs')

//Signup
const getSignup = (req, res) => {
    res.render('signup')
};

const checkIfEmailExists = async(email) => {
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            console.log('ese correo ya está en uso');
            return true;
        } else {
            console.log('correo disponible');
            return false;            
        }
    } catch (err) {
        console.error('Error checando existencia del email', err);
        throw err;
    }
};

const postSignup = async (req, res) => {
    const { name,email, password } = req.body;
    try {
        const emailExists = await checkIfEmailExists(email);
        if(emailExists) {
            return res.status(400).json({ message: 'este correo está en uso.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); //Encriptación de la contraseña
        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            isAdmin: true
        });

        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        console.error('Error al intentar registrar: ', err);
        res.status(500).json({ error: 'Error del servidor durante el registro' });
    }
};

//LOGIN
const getLoginForm = (req, res) => {
    res.render('login');
};

const postLoginForm = async (req, res) => {
    const { email, password } = req.body;
    try {
        const authenticatedUser = await User.findOne({ email });
        if(!authenticatedUser) {
            return res.status(400).json({ message: 'email o password incorrectos' })
        };
        const isMatch = await bcrypt.compare(password, authenticatedUser.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'email o password incorrectos' })
        }

        req.session.isAuthenticated = true;
        req.session.isAdmin = authenticatedUser.isAdmin;
        req.session.user = authenticatedUser;
        // console.log('authenticatedUser', authenticatedUser)
        // console.log('req.session.isAdmin', req.session.isAdmin)
        res.redirect('/');
    } catch (error) {
        console.error('Error en el login: ', error);
        res.status(500).json({ message: 'Error en el servidor durante el login' });
    }
};




// const USERNAME = "admin";
// const PASSWORD = "admin";

// const getLoginForm = (req, res) => {
//     res.send(`<link rel="stylesheet" href="/style.css">
//         <form method = "POST" action = "/login">
//             <input type="username" name= "username" placeholder= "Usuario" requires />
//             <input type="password" name= "password" placeholder= "Contraseña" required />
//             <button  class= "btn" type= "submit"> Iniciar sesión </button>
//         `);
// }

// const postLoginForm = (req, res) => {
//     const { username, password } = req.body;

//     //To do: CRear un modelo de Users. Crear un Schema que guarde los usuarios de tipo administrador en tu base de datos de MongoDB (username, password).

//     //To do+: Crear una página para registrar nuevos usuarios administradores

//     //Si el usuario y contraseña coinciden con el de nuestra "base de datos", entonces nos guardaremos la información de que el cliente está autentificado.
//     if (username === USERNAME && password === PASSWORD) {
//         req.session.isAuthenticated = true;
//         res.locals.isAdmin = true;

//         res.redirect('/');
//     } else {
//         res.send('Usuario o contraseña incorrectos');
//     }
// }

const logout = (req, res) => {
    console.log('Logout');
    
    req.session.destroy(err => {
        if (err) {
            return res.send('Error al cerrar sesión');
        }
        res.redirect('/');
    });
}

module.exports = {
    getSignup,
    postSignup,
    getLoginForm,
    postLoginForm,
    logout
}