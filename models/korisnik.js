const mongoose = require('mongoose')

const korisnikSchema = new mongoose.Schema({
    ime: {
        type: String,
        required: true
    },
    prezime: {
        type: String,
        required: true
    },
    korisnickoIme: {
        type: String,
        required: true,
        unique: true
    },
    lozinka: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
    },
    posudba: {
        type: Boolean,
        required: true
    },
    status: {
        type: Boolean
    }
})

module.exports = mongoose.model('Korisnik', korisnikSchema)