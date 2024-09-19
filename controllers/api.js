const Apartment = require('../models/apartments.model')

const getApartments = async(req, res) => {
  try{

    const limit = parseInt(req.query.limit) || 10; //el límite por default será 10 pero cambiará de acuerdo a la querystring que pida el cliente
    console.log(limit);
    console.log(typeof(limit))

    //Comprobar el valor del parámetro req.query.limit que esté entre 1 y 100000
    if(req.query.limit<1 || req.query.limit>100000) {
        res.status(400).json({
        message: "the limit parameter must be a number between 1 and 100000"
    })
}
    if(typeof req.query.limit != Number ) {
        return res.status(400).json({
        message: "the limit parameter must be a Number"
});
}



    const apartments = await Apartment.find().limit(limit);
    console.log('apartments: ', apartments);
    
    //2. Devolver una respuesta
    res.status(200).json({ //el .status(200) es sólo para estar seguros que nos avisará  cuando todo haya ido bien.
        message: "Query executed succesfully",
        results: apartments //To do: Completar con todos los apartamentos de la base de datos.
    })
  } catch (error) {
    console.error('Error al obtener los apartamentos: ', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

module.exports = {
    getApartments
}