const express = require("express");
const router = express.Router();
const Knjiga = require("../models/knjiga");
const Autor = require("../models/autor");
// let knjiga = require("../models/knjiga");
const path = require('path')
const uploadPath = path.join('public', Knjiga.coverImageBasePath)
const multer = require('multer')
const imageMimeTypes = ['image/jpeg', 'image/png']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

//Route za sve knjiga / prikaz svih knjiga / GET
router.get("/", async (req, res) => {
  try {
    const knjige = await Knjiga.find({});
    const autori = await Autor.find({});
    res.send({ 
      knjige: knjige,
      autori: autori
    });
  } catch {
    res.send("Greska");
  }
});

//Route za prikaz jedne knjige / detalji o knjizi (naslovu) / GET
router.get("/:id", async (req, res) => {
  try {
    const knjiga = await Knjiga.findById(req.params.id);
    res.send({
      knjiga: knjiga
    });
  } catch {
    res.send("Greška");
  }
});

//Route za kreiranje knjiga / kreiranje nove knjige (naslova) / POST
router.post("/", upload.single('slika'), async (req, res) => {
  // const fileName = req.body.coverImageName != null ? req.file.filename : null
  const knjiga = new Knjiga({
    naziv: req.body.naziv,
    opis: req.body.opis,
    datumObjavljivanja: req.body.datumObjavljivanja,
    brojStranica: req.body.brojStranica,
    kolicina: req.body.kolicina,
    zanr: req.body.zanr,
    coverImageName: req.body.coverImageName,
    autor: req.body.autor
  })
  try {
    const newKnjiga = await knjiga.save()
  } catch(err) {
    console.log(err)
  } 
})




module.exports = router;