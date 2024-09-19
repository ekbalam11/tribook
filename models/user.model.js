const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate: {
                validator: function(v) {
                    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
                },
                message: props => `${props.value} no es un correo válido!`
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validate: {
                validator: function(value) {
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
                },
                message: 'La contraseña debe contener las siguientes características: 8 caracteres, contener al menos una letra mayúscula, una minúscula, un número y un caractér especial'
            }
        },
        isAdmin: {
            type: Boolean,
            default: true
        },
    }
)

const User = model('User', userSchema);

module.exports = User;