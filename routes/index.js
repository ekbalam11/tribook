// Rutas "públicas" de la app
const express = require('express');
const router = express.Router();

//importamos todos los controladores de controllers/ index.js
const indexControllers = require('../controllers/index.js');

// Router funciona igual que e l"app" para crear los endpoints. Nos permite definir un conjunto arbitrario de rutas
router.get('/', indexControllers.getApartments);

//Buscar apartamentos: Crear una nueva ruta al endpoint /search
router.get('/search', indexControllers.searchApartments);

// Ruta dinámica para detalle del apartamento
router.get('/apartment/:idApartment', indexControllers.getApartmentById)

// Pedir una nueva reserva
router.post('/apartment/new-reservation', indexControllers.postNewReservation);


//Tenemos que exportar estas rutas para que sean usadas en app.js
module.exports = router;