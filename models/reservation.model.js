const { Schema, model } = require('mongoose');

const reservationSchema = Schema({
    email: {
        type: String,
        required: true,
        //Agregar validación REGEX para el formato del correo
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        //To do: Averiguar como realizar una validación para que StartDate sea siempre antes que endDate
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'//si no especifica por defecto es pending
    },
    apartment: { type: Schema.Types.ObjectId, ref:'Apartment' }
});

const Reservation = model('Reservation', reservationSchema);

module.exports = Reservation;