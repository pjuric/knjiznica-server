const express = require("express");
const router = express.Router();
const Knjiga = require("../models/knjiga");
const Autor = require("../models/autor");
const path = require("path");
const uploadPath = path.join("public", Knjiga.coverImageBasePath);
const multer = require("multer");
const imageMimeTypes = ["image/jpeg", "image/png"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

//Route za sve knjiga / prikaz svih knjiga / GET
router.get("/", async (req, res) => {
  try {
    const knjige = await Knjiga.find({});
    const autori = await Autor.find({});
    res.send({
      knjige: knjige,
      autori: autori,
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
      knjiga: knjiga,
    });
  } catch {
    res.send("Greška");
  }
});

//Route za kreiranje knjiga / kreiranje nove knjige (naslova) / POST
router.post("/", upload.single("slika"), async (req, res) => {
  const knjiga = new Knjiga({
    naziv: req.body.naziv,
    opis: req.body.opis,
    datumObjavljivanja: req.body.datumObjavljivanja,
    brojStranica: req.body.brojStranica,
    kolicina: req.body.kolicina,
    zanr: req.body.zanr,
    coverImageName: req.body.coverImageName,
    autor: req.body.autor,
  });
  try {
    const newKnjiga = await knjiga.save();
  } catch (err) {
    console.log(err);
  }
});
 
//Route za uređivanje knjiga (naslova) / ažuriranje postojećeg naslova / PUT
router.put("/:id", async (req, res) => {
  let knjiga;
  try {
    knjiga = await Knjiga.findById(req.params.id);
    knjiga.naziv = req.body.naziv,
    knjiga.opis = req.body.opis,
    knjiga.datumObjavljivanja = req.body.datumObjavljivanja,
    knjiga.brojStranica = req.body.brojStranica,
    knjiga.kolicina = req.body.kolicina,
    knjiga.zanr = req.body.zanr,
    knjiga.coverImageName = req.body.coverImageName,
    knjiga.autor = req.body.autor,
    await knjiga.save();
  } catch (err) {
    console.log(err);
  }
});

//Route za uređivanje kolicine knjiga nakon rezervacije / ažuriranje stanja kolicine naslova / PUT
router.put("/rezervacija/:id", async (req, res) => {
  let knjiga;
  try {
    knjiga = await Knjiga.findById(req.params.id);
    knjiga.kolicina = knjiga.kolicina - 1,
    await knjiga.save();
  } catch (err) {
    console.log(err);
  } 
});

//Route za uređivanje kolicine knjiga nakon vraćanja / ažuriranje stanja kolicine naslova / PUT
router.put("/vracanje/:id", async (req, res) => {
  let knjiga;
  try {
    knjiga = await Knjiga.findById(req.params.id);
    knjiga.kolicina = knjiga.kolicina + 1,
    await knjiga.save();
  } catch (err) {
    console.log(err);
  } 
});

//Route za brisanje knjige (naslova) / brisanje postojećeg naslova / DELETE
router.delete("/:id", async (req, res) => {
  let knjiga;
  try {
    knjiga = await Knjiga.findById(req.params.id);
    await knjiga.remove();
  } catch (err) {
    console.log(err);
  }
});

//Route za pretragu knjiga po nazivu
router.get('/pretraga/:naziv', async (req, res) => {
  let query = Knjiga.find()
  if (req.params.naziv != null && req.params.naziv != '') {
    query = query.regex('naziv', new RegExp(req.params.naziv, 'i'))
  } else{
    res.send("Nema dostupnih knjiga")
  }

  try {
    const knjige = await query.exec()
    res.send({
      knjige: knjige
    });
  } catch {
    console.log(err)
  }
})

module.exports = router;
