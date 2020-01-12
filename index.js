const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')
const app = express()

const {
  notFound,
  developmentErrors,
  productionErrors
} = require('./utils/errorHandlers')

const fincas = require('./routes/fincas')

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

// Routes
app.get('/', (req, res) => {
  res.render('home')
})

app.post('/email', (req, res) => {
  console.log(req.body)
  res.redirect('/')
})

app.get('/eventos', (req, res) => {
  res.render('eventos')
})

app.get('/wedding', (req, res) => {
  res.render('wedding')
})

fincas(app)

// Not found handler
app.use(notFound)

// Error handlers
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(developmentErrors)
}

app.use(productionErrors)

// Server listener
app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port http://localhost:3000`)
})