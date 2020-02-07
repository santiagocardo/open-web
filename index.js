const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')
const mongoose = require('mongoose')
const passport = require('passport')
const app = express()

// import environmental variables from our variables.env file
require('dotenv').config({ path: '.env' })

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
})

const {
  catchErrors,
  notFound,
  developmentErrors,
  productionErrors
} = require('./utils/errorHandlers')

const fincasRouter = require('./routes/fincas')
const authRouter = require('./routes/auth')
const { getRandomFincas } = require('./services/fincas')

// Security
app.use(helmet())

// view engine setup
app.set('views', path.join(__dirname, 'views')) // this is the folder where we keep our pug files
app.set('view engine', 'pug') // we use the engine pug, mustache or EJS work great too

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')))

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser())

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false
}))

// Passport JS is what we use to handle our logins
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.get('/', catchErrors(getRandomFincas))

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

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.use('/fincas', fincasRouter)
app.use('/login', authRouter)

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
  console.log(`Listening on port: 3000`)
})