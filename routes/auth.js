const express = require('express')

const router = express.Router()
const { login } = require('../services/auth')

router.get('/', (req, res) => {
  res.render('login')
})

router.post('/', login, (req, res) => { 
  res.redirect('/fincas/crear')
})

module.exports = router