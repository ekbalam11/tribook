//Aquí creamos un conjunto de funciones que van a dar respuesta a nuestras rutas
const Apartment = require('../models/apartments.model.js')


const getNewApartmentForm = (req, res) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
//exportamos y del res.render que está en index.js
    res.render('new-apartment', {
        apartment: {},
        cloudName,
        uploadPreset
    });
}
const getEditApartmentForm = async (req, res) => {
    //1. Recuperar el apartmento identificado por su idAPartment de la base de datos
    const { idApartment } = req.params;

    //2. Ir a la base de dadots y obtener el apartamento dado su Id
    const apartment = await Apartment.findById(idApartment);
    
    // 3. Pasar este apartamento a la vista
    res.render('new-apartment', {
        apartment
    })

} 

const postNewApartment = async (req, res) => {

    // Me han metido más servicios en el req.services que los servicios que yo quiero? kitchen, wifi, etc. res.status(400).send ('Ha ocurrido un error');
    
    //¿Cómo detecto si estoy añadiendo un apartamento o editando un apartamento? Si lo estoy editando, ya tengo un Id.
    const { id, latitude, longitude, country, province, city } = req.body; 
    const { pets, parties, smoking, music } = req.body;
    const { wifi, airConditioner, kitchen, disability, heater, tv } = req.body;

    if(id) {
        //To do: 
        // 1. Buscar el documento en la base de datos a partir de su id
            await Apartment.findByIdAndUpdate(id, req.body);
            
        
        // 2. Actualizar sus campos a partir del req.body
        res.send('Apartamento actualizado');
        return
    }

    const coordinates = {
        type: 'Point',
        latitude: parseFloat(latitude) || 0, //Default to 0 in case is missing
        longitude: parseFloat(latitude) || 0,
        country: country,
        province: province,
        city: city,
    };
    console.log('latitude: ', latitude, 'longitud: ', longitude);
    console.log('coordinates: ', coordinates);

    const rules = {
        pets: req.body['rules.pets'] === 'true',
        parties: req.body['rules.parties'] === 'true',
        smoking: req.body['rules.smoking'] === 'true',
        music: req.body['rules.music'] === 'true',
    };
    const amenities = {
        wifi: req.body['amenities.wifi'] === 'true',
        airConditioner: req.body['amenities.airConditioner'] === 'true',
        kitchen: req.body['amenities.kitchen'] === 'true',
        disability: req.body['amenities.disability'] === 'true',
        heater: req.body['amenities.heater'] === 'true',
        tv: req.body['amenities.tv'] === 'true',
    };
    console.log('rules: ', rules);
    console.log('amenities: ', amenities);
    
    await Apartment.create({ //Este Apartment viene exportado desde el modelo. El método.create agrega los elementos que uno le pida de la información que el usuario agregó en el Form
        title: req.body.title,
        type: req.body.type,
        description: req.body.description,
        price: req.body.price,
        squareMeters: req.body.squareMeters,
        rules: rules,
        rooms: req.body.rooms,
        bathrooms: req.body.bathrooms,
        persons: req.body.persons,
        photo: req.body.photo,
        amenities: amenities,
        coordinates: coordinates,
        country: country,
        province: province,
        city: city
    })
    res.send('Apartamento creado <a href="/"><button type= "submit"> Ir a home </button></a> <a href="/admin/apartment/new-apartment"><button type= "submit"> Subir otro anuncio </button></a>')
}

const postUnpublishApartment = async (req, res) => {
    try {
      const { idApartment } = req.params;
      // Find and update the apartment to unpublish it
      const selectedApartment = await Apartment.findByIdAndUpdate(idApartment, {
        isPublished: false, // Mark apartment as unpublished
        unpublishedAt: new Date(), // Record the unpublish date
      });
      req.flash("success", "Apartamento despublicado con éxito");
      return res.redirect("/"); // Redirect to homepage on success
    } catch (error) {
      console.log(error);
      // Redirect with error message
      req.flash("error", "Error despublicando apartamento");
      return res.redirect("/");
    }
  };

const postPublishApartment =
  ("/apartments/:id/publish",
  async (req, res) => {
    try {
      const { idApartment } = req.params;
        // Find and update the apartment to publish it
      const selectedApartment = await Apartment.findByIdAndUpdate(idApartment, {
        isPublished: true, // Mark apartment as published
        unpublishedAt: null, // Reset the unpublish date
      });
      req.flash("success", "Apartamento publicado con éxito");
      // Redirect to homepage on success
      return res.redirect("/");
    } catch (error) {
      console.log(error);
    // Redirect with error message
      req.flash("error", "Error publicando apartamento");
      return res.redirect("/");
    }
  });

module.exports = {
    getNewApartmentForm,
    postNewApartment,
    getEditApartmentForm,
    postUnpublishApartment,
    postPublishApartment
}