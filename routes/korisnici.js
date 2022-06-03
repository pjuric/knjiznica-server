const express = require("express");
const router = express.Router();
const Korisnik = require("../models/korisnik");
const Knjiga = require("../models/knjiga");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//Route za sve korisnike / prikaz svih korisnika / GET
router.get("/", async (req, res) => {
  try {
    const korisnici = await Korisnik.find({});
    res.send({ korisnici: korisnici });
  } catch {
    res.send("Greska");
  }
});

//Route za prikaz jednog korisnika i njegovih zahtjeva / detalji o korisniku / GET
router.get("/:id", async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.params.id);
    res.send({
      korisnik: korisnik,
    });
  } catch (err) {
    res.send("Greska");
  }
});

//Route za novog korisnika / kreiranje novog korisnika / POST
router.post("/", async (req, res) => {
  const newPassword = await bcrypt.hash(req.body.lozinka, 10)
  const korisnik = new Korisnik({
    ime: req.body.ime,
    prezime: req.body.prezime,
    korisnickoIme: req.body.korisnickoIme,
    lozinka: newPassword,
    admin: req.body.admin,
    email: req.body.email,
    posudba: req.body.posudba,
    status: req.body.status
  });
  try {
    const newKorisnik = await korisnik.save();
    res.send("Success");
  } catch (err) {
    console.log(err);
  }
});

//Route za uređivanje korisnika / ažuriranje postojećeg korisnika / PUT
router.put("/:id", async (req, res) => {
  let korisnik;
  const newPassword = await bcrypt.hash(req.body.lozinka, 10)
  try {
    korisnik = await Korisnik.findById(req.params.id);
    korisnik.ime = req.body.ime;
    korisnik.prezime = req.body.prezime;
    korisnik.korisnickoIme = req.body.korisnickoIme;
    korisnik.lozinka = newPassword;
    korisnik.admin = req.body.admin;
    korisnik.email = req.body.email;
    korisnik.posudba = req.body.posudba;
    korisnik.status = req.body.status;
    await korisnik.save();
    res.send("Success");
  } catch (err) {
    res.send(err);
  }
});

//Route za uređivanje statusa posudbe (rezervacije) / ažuriranje korisnk.posudba kada korisnik rezervira / PUT
router.put("/rezervacija/:id", async (req, res) => {
  let korisnik;
  try {
    korisnik = await Korisnik.findById(req.params.id);
    korisnik.posudba = req.body.posudba; 
    await korisnik.save();
    res.send("Success");
  } catch (err) {
    res.send(err);
  }
});

//Route za brisanje korisnika / brisanje postojećeg korisnika / DELETE
router.delete("/:id", async (req, res) => {
  let korisnik;
  try {
    korisnik = await Korisnik.findById(req.params.id);
    await korisnik.remove();
    res.send("Success")
  } catch (err) {
    res.send(err);
  }
});

//Route za sve prijavu korisnika u sustav / POST
router.post('/login', async (req, res) => {
	const korisnik = await Korisnik.findOne({
		korisnickoIme: req.body.korisnickoIme,
	})

	if (!korisnik) {
		return { status: 'greska', error: 'Ne postoji korisnik sa ovim korisničkim imenom' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.lozinka,
		korisnik.lozinka
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				korisnickoIme: korisnik.korisnickoIme,
				email: korisnik.email,
        admin: korisnik.admin,
        status: korisnik.status,
        posudba: korisnik.posudba,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        id: korisnik._id
			},
			process.env.DATABASE_URL
		)
		return res.json({ status: 'ok', korisnik: token })
	} else {
		return res.json({ status: 'error', korisnik: false })
	}
})

//Route za pretragu korisnika po imenima / GET
router.get('/pretraga/:ime', async (req, res) => {
  let query = Korisnik.find()
  if (req.params.ime != null && req.params.ime != '') {
    query = query.regex('ime', new RegExp(req.params.ime, 'i'))
  } else{
    res.send("Nema dostupnih korisnika")
  }

  try {
    const korisnici = await query.exec()
    res.send({
      korisnici: korisnici
    });
  } catch {
    console.log(err)
  }
})

module.exports = router;
