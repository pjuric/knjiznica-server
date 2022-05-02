const express = require("express");
const router = express.Router();
const Autor = require("../models/autor");
const Knjiga = require("../models/knjiga");
let user = require("../models/autor");

//Route za sve autore / prikaz svih autora / GET
router.get("/", async (req, res) => {
  try {
    const autori = await Autor.find({});
    res.send({ autori: autori });
  } catch {
    res.send("Greska");
  }
});

//Route za prikaz jednog autora i njegovih autorskih naslova / detalji o autoru / GET
router.get("/:id", async (req, res) => {
  try {
    const autor = await Autor.findById(req.params.id);
    const knjige = await Knjiga.find({ autor: req.params.id }).limit(6).exec()
    res.send({
      autor: autor,
      knjige: knjige
    });
  } catch(err) {
    res.send("Greska");
    
  }
});

//Route za novog autora / kreiranje novog autora / POST
router.route("/").post((req, res, next) => {
  user.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

//Route za uređivanje autora / ažuriranje postojećeg autora / PUT
router.put("/:id", async (req, res) => {
  let autor;
  try {
    autor = await Autor.findById(req.params.id);
    autor.ime = req.body.ime;
    autor.prezime = req.body.prezime;
    autor.biografija = req.body.biografija;
    await autor.save();
  } catch (err) {
    console.log(err);
  }
});

//Route za brisanje autora / brisanje postojećeg autora / DELETE
router.delete("/:id", async (req, res) => {
  let autor;
  try {
    autor = await Autor.findById(req.params.id);
    await autor.remove();
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
