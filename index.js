const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')
const app = express()

// Security
app.use(helmet())

// View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')))

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home')
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port http://localhost:3000`)
})