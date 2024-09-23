const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const apiControllers = require('../controllers/api');
const constants = require('../config/constants');

router.get('/apartments', query("limit").optional().isInt({ min: constants.MIN_DOCUMENTS, max: constants.MAX_DOCUMENTS }).withMessage(`The limit parameter must be a number between 1 and ${constants.MAX_DOCUMENTS}`).default(constants.MAX_DOCUMENTS) , apiControllers.getApartments); //query es la cadena de validación de express-validator  para enriquecer la comunicación entre servidor y cliente. 

module.exports = router;