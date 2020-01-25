const express = require('express')
const passport = require('passport')
const { catchErrors } = require('../utils/errorHandlers')
const { upload, resize, addFinca } = require('../services/fincas')

const router = express.Router()

router.get('/', catchErrors(async (req, res) => {
  // const fincas = await Fincas.find()

  // res.render('fincas', { fincas })
  res.render('fincas', { path: req.path })
}))

router.get('/crear', catchErrors(async (req, res) => {
  res.render('crear-finca')
}))

router.post(
  '/add',
  upload,
  catchErrors(resize),
  catchErrors(addFinca)
)

module.exports = router