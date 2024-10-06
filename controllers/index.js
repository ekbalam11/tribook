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
    let apartment;
    try {
        // Extract reservation details from the request body
        const { email, startDate, endDate, idApartment } = req.body;

        apartment = await Apartment.findById(idApartment);
        
        if (!apartment) {
            return res.status(404).json({ error: "Apartment not found" });
        }

     
        const reservations = await getApartmentReservations(idApartment);
        console.log('reservations: ', reservations); 

        const conflictes = await Reservation.findOne({
            apartment: idApartment,
            $or: [
              { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
            ]
          });
          console.log('conflictes: ', conflictes)

          if (conflictes) {
            req.flash('error', 'Fechas de la reserva no disponibles');
          return  res.redirect(`/apartment/${idApartment}`); 
          } else {
      
        const newReservation = await Reservation.create({
            email,
            startDate,
            endDate,
            apartment
        });

        return res.render('reservation-summary', {
            reservation: newReservation,
            selectedApartment: apartment,
            errorMessage: req.flash('error'),
        });
    }
    } catch (err) {
      
        console.error(err);
        req.flash('error', "Reserva no creada, por favor, añade datos válidos.") 
        return res.render('detail-apartment', {
            errorMsg: req.flash('error'),
            selectedApartment: apartment
        })
    }
}

module.exports = {
    getApartments,
    getApartmentById,
    searchApartments,
    postNewReservation
}

