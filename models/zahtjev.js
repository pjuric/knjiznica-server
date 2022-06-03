const mongoose = require("mongoose");

const zahtjevSchema = new mongoose.Schema({
  korisnik: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Korisnik",
  },
  knjiga: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Knjiga",
  },
  pocetak: {
    type: String,
  },
  kraj: {
    type: String
  },
  rezervirana: {
    type: Boolean,
    default: true,
  },
  podignuta: {
    type: Boolean,
    default: false,
  },
  vracena: {
    type: Boolean,
    default: false,
  },
  datumVracanja: {
    type: String,
  },
  korisnickoIme: {
    type: String,
  },
  knjigaNaziv: {
    type: String
  }
});

module.exports = mongoose.model("Zahtjev", zahtjevSchema);
