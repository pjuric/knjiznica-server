const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/bookCovers'

const knjigaSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true
  },
  opis: {
    type: String
  },
  zanr: {
    type: String
  },
  datumObjavljivanja: {
    type: Date,
    required: true
  },
  brojStranica: {
    type: Number,
  },
  kolicina: {
    type: Number,
    required: true
  },
  coverImageName: {
    type: String,
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Autor'
  }
})

knjigaSchema.virtual('coverImagePath').get(function() {
  if (this.coverImageName != null) {
    return path.join('/', coverImageBasePath, this.coverImageName)
  }
})

module.exports = mongoose.model('Knjiga', knjigaSchema)
module.exports.coverImageBasePath = coverImageBasePath