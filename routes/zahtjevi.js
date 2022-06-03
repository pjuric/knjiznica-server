const express = require("express");
const router = express.Router();
const Zahtjev = require("../models/zahtjev");

//Route za sve zahtjeve / prikaz svih zahtjeva / GET
router.get("/", async (req, res) => {
  try {
    const zahtjevi = await Zahtjev.find({});
    res.send({ zahtjevi: zahtjevi });
  } catch {
    res.send("Greska");
  }
});

//Route za prikaz jednog zahtjeva / detalji o zahtjevu / GET
router.get("/:id", async (req, res) => {
  try {
    const zahtjev = await Zahtjev.findById(req.params.id);
    res.send({
      zahtjev: zahtjev,
    });
  } catch (err) {
    res.send("Greska");
  }
});

//Route za provjeru aktivnih rezervacija prijavljenog korisnika / GET
router.get("/korisnik/:id", async (req, res) => {
  try {
    const zahtjevi = await Zahtjev.find({
      korisnik: req.params.id,
      rezervirana: true,
      podignuta: false,
    }).exec();
    res.send({
      zahtjevi: zahtjevi,
    });
  } catch (err) {
    res.send("Greska");
  }
});

//Route za dohvat rezervacija (zahtjeva) prijavljenog korisnika / GET
router.get("/korisnikzahtjevi/:id", async (req, res) => {
  try {
    const zahtjevi = await Zahtjev.find({
      korisnik: req.params.id,
    }).exec();
    res.send({
      zahtjevi: zahtjevi,
    });
  } catch (err) {
    res.send("Greska");
  }
});

//Route za novi zahtjev / kreiranje novog zahtjeva / POST
router.post("/", async (req, res) => {
  const thisDate = new Date();
  const nextWeek = new Date();

  thisDate.setDate(new Date().getDate());
  nextWeek.setDate(new Date().getDate() + 15);

  const zahtjev = new Zahtjev({
    korisnik: req.body.korisnik,
    knjiga: req.body.knjiga,
    pocetak: thisDate.toLocaleDateString(),
    kraj: nextWeek.toLocaleDateString(),
    korisnickoIme: req.body.korisnickoIme,
    knjigaNaziv: req.body.knjigaNaziv
  });
  await zahtjev.save();
  res.send(zahtjev);
});

//Route za uređivanje stanja o podizanju / ažuriranje stanja podignuta / PUT
router.put("/podizanje/:id", async (req, res) => {
  let zahtjev;
  try {
    zahtjev = await Zahtjev.findById(req.params.id);
    zahtjev.podignuta = true,
    await zahtjev.save();
  } catch (err) {
    console.log(err);
  } 
});

//Route za uređivanje stanja o vraćanju / ažuriranje stanja vracena i datumVracanja / PUT
router.put("/vracanje/:id", async (req, res) => {
  let zahtjev;
  const thisDate = new Date();
  thisDate.setDate(new Date().getDate());
  try {
    zahtjev = await Zahtjev.findById(req.params.id);
    zahtjev.vracena = true,
    zahtjev.datumVracanja = thisDate.toLocaleDateString(),
    await zahtjev.save();
  } catch (err) {
    console.log(err);
  } 
});

//Route za brisanje zahtjeva / kada korisnik ponisti rezervaciju (prije podizanja knjige) / DELETE
router.delete("/:id", async (req, res) => {
  let zahtjev;
  try {
    zahtjev = await Zahtjev.findById(req.params.id);
    await zahtjev.remove();
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
