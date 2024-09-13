// Rutas de administrador

// Rutas "públicas" de la app
const express = require('express');
const router = express.Router();

//Importar todos los controladores de controllers/admin.js

//Crear primer endpoint de administrador que es el que nos permite mostrar un formulario para añadir un nuevo apartamento
const adminControllers = require('../controllers/admin.js');
const indexControllers = require('../controllers/index.js')

//Todas las rutas de administrador, si entramos por '/admin' significa que el usuario es de tipo de administrador. CAmbiemos el valor de la variable res.locals.isAdmin

router.use((req, res, next) => {
    res.locals.isAdmin = true;
    next();
});

router.get('/apartment/new-apartment', adminControllers.getNewApartmentForm);
router.post('/apartment/new-apartment', adminControllers.postNewApartment);
router.get('/apartment/:idApartment/edit', adminControllers.getEditApartmentForm);
// router.post('/:idApartment/edit', adminControllers.postEditApartmentForm)
router.get('/apartment/:idApartment', indexControllers.getApartmentById);



//Exportar estas rutas para que sean usadas en app.js
module.exports = router;