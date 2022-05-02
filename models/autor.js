const mongoose = require('mongoose')

const autorSchema = new mongoose.Schema({
    ime: {
        type: String,
    },
    prezime: {
        type: String,
    },
    biografija: {
        type: String
    }
})

module.exports = mongoose.model('Autor', autorSchema)