const express = require('express')
const passport = require('passport')
const { catchErrors } = require('../utils/errorHandlers')

function fincas (app) {
  const router = express.Router()
  app.use('/fincas', router)

  router.get('/', catchErrors(async (req, res) => {
    // const fincas = await Fincas.find()

    // res.render('fincas', { fincas })
    res.render('fincas')
  }))
}

module.exports = fincas