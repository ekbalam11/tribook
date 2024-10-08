// Importamos el modelo
const Apartment = require('../models/apartments.model.js')
const Reservation = require('../models/reservation.model.js')
const Users = require('../models/user.model.js')

const getApartments = async (req, res) => {
    
    //Obtenemos todos los apartamentos de la base de datos
    const apartments = await Apartment.find();
    const users = await Users.find();

    //Registro de visitas al sitio
    req.session.visitedHome += 1;

    res.render('home', {
        users,
        apartments,
        visitedHome: req.session.visitedHome 
    })
};

const getApartmentById = async(req, res) => {
    // 1. Voy al modelo para obtener el parámetro dado su id
    const { idApartment } = req.params;
    const selectedApartment = await Apartment.findById(idApartment);
    
    res.render('detail-apartment', {
        selectedApartment
    })
};

//Buscar apartamentos. Parsear la query string
// const searchApartments = async (req, res) => {
//     // Paso 3: buscar apartamentos. Parsear la query string que recibo del formulario
    
//     const { maxPrice, maxPersons, city } = req.query;

//     // Obtener del modelo todos los apartamentos cuyo precio sea menor que el precio máximo que el usuario está dispuesto a pagar

//     // Pasarle estos apartamentos ya filtrados a la vista
//     const apartments = await Apartment.find({ 
//         price: { $lte:  maxPrice },
//         persons: { $gte: maxPersons }
//     });

//     const cities = await Apartment.find({
//         coordinates.city: {  }
//     })

//     res.render('home', {
//     apartments
//     });
// }

const searchApartments = async (req, res) => {
    try{
        const { maxPrice, minPersons, country } = req.query;
        if(!maxPrice || !minPersons) {
            return res.status(400).send('Por favor, ingresa un precio máximo y un número de personas')
        }
        const query = {
            price: { $lte: maxPrice },
            persons: { $gte: minPersons }
        };
        if(country) {
            query['coordinates.country'] = country;
        }
        
        const apartments = await Apartment.find(query);

        res.render('home', { apartments });
    } catch (error) {
        console.error('Error al buscar en la base de datos de apartamentos', error);
        res.status(500).send('Ocurrió un error al filtrar')
    }
}

const postNewReservation = async (req, res) => {
    // 1. Hacer una peticion tipo POST -> desestructurar el req.body y obtener todos los datos de la reserva
    const { email, startDate, endDate, idApartment } = req.body;
    const apartment = await Apartment.findById(idApartment)
    // Método 2a. Dado el Id del apartamento, recuperar el apartment de la colección y luego crear la reserva con Reservation.create() pasando el apartmento que acabamos de recuperar. 
    const newReservation = await Reservation.create({  //Importante no olvidar importar el modelo "const Reservation = require('../models/reservation.model.js')"
        email,
        startDate,
        endDate,
        apartment
    })


    res.json(newReservation);
    // Método 2b. Crear directamente la reserva con Reservation.create() y establecer el campo apartment, que de tipo ObjectID, con el idntificador del apartamento recuperado del formulario.

    // 3. Podemos contestar con algún tipo de mensaje al usuario sobre la reservada creada. e.g res.json(newReservation) newReservation es la reserva que acabamos de crear
}

module.exports = {
    getApartments,
    getApartmentById,
    searchApartments,
    postNewReservation
}

