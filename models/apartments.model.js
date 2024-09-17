//Crear esquema del apartamento
const { Schema, model } = require('mongoose');
const { type } = require('os');

const apartmentSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: [String],
        enum: ['casa', 'apartamento', 'cueva', 'nido', 'habitacion', 'chalet', 'palacio', 'otro'],
        required: true
    },
    description: {
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    squareMeters: {
        type: String,
        required: true,
        min: 10
    },
    rules: {
        pets: { type: Boolean, default: false },
        parties: { type: Boolean, default: false },
        smoking: { type: Boolean, default: false },
        music: { type: Boolean, default: false },
    },
    rooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: false
    },
    persons: {
        type: Number,
        required: true,
        min: 1
    },
    photo: {
        type: [String],
        min: 1,
        required: true,
        //match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'Please fill a valid URL for the image']
    },
    amenities: { //array de strings
        wifi: { type: Boolean, default: false },
        airConditioner: { type: Boolean, default: false },
        kitchen: { type: Boolean, default: false },
        disability: { type: Boolean, default: false },
        heater: { type: Boolean, default: false },
        tv: { type: Boolean, default: false },
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        country: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        latitude: {
            type: Number,
            required: false
        },
        longitude: {
            type: Number,
            required: false
        }
    }   
});

const Apartment = model('Apartment', apartmentSchema);

module.exports = Apartment;