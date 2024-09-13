const USERNAME = "admin";
const PASSWORD = "admin";

const getLoginForm = (req, res) => {
    res.send(`<link rel="stylesheet" href="/style.css">
        <form method = "POST" action = "/login">
            <input type="username" name= "username" placeholder= "Usuario" requires />
            <input type="password" name= "password" placeholder= "Contraseña" required />
            <button  class= "btn" type= "submit"> Iniciar sesión </button>
        `);
}

const postLoginForm = (req, res) => {
    const { username, password } = req.body;

    //To do: CRear un modelo de Users. Crear un Schema que guarde los usuarios de tipo administrador en tu base de datos de MongoDB (username, password).

    //To do+: Crear una página para registrar nuevos usuarios administradores

    //Si el usuario y contraseña coinciden con el de nuestra "base de datos", entonces nos guardaremos la información de que el cliente está autentificado.
    if (username === USERNAME && password === PASSWORD) {
        req.session.isAuthenticated = true;
        res.locals.isAdmin = true;

        res.redirect('/');
    } else {
        res.send('Usuario o contraseña incorrectos');
    }
}

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
    getLoginForm,
    postLoginForm,
    logout
}