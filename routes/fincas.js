const express = require('express')
const passport = require('passport')
const { catchErrors } = require('../utils/errorHandlers')
const { isLoggedIn } = require('../services/auth')

const {
  upload,
  resize,
  addFinca,
  getFinca,
  newFinca
} = require('../services/fincas')

const router = express.Router()

router.get('/', catchErrors(async (req, res) => {
  // const fincas = await Fincas.find()

  // res.render('fincas', { fincas })
  res.render('fincas', { path: req.path })
}))

router.get('/finca/:code', catchErrors(getFinca))

router.get('/crear', isLoggedIn, catchErrors(newFinca))

router.post(
  '/add',
  isLoggedIn,
  upload,
  catchErrors(resize),
  catchErrors(addFinca)
)

module.exports = router