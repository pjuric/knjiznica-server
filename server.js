if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

let cors = require("cors");
const express = require('express')
const app = express()
app.use(cors());
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(express.json())

const indexRouter = require('./routes/index')
const autorRouter = require('./routes/autori')
const knjigaRouter = require('./routes/knjige')
const korisnikRouter = require('./routes/korisnici')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Spojeni ste na Mongoose'))

app.use('/', indexRouter)
app.use('/autori', autorRouter)
app.use('/knjige', knjigaRouter)
app.use('/korisnici', korisnikRouter)

app.listen(process.env.PORT || 8081)
