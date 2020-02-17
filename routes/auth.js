const express = require('express')

const router = express.Router()
const { login, isLoggedIn, updatePassword } = require('../services/auth')
const { catchErrors } = require('../utils/errorHandlers')

router.get('/', (req, res) => {
  res.render('login')
})

router.post('/', login, (req, res) => { 
  res.redirect('/fincas/listar')
})

router.post('/update-password', isLoggedIn, catchErrors(updatePassword))

module.exports = router