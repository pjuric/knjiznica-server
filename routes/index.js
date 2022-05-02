//Route za prikaz stanja poslužitelja
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Poslužitelj radi')
})

module.exports = router