const express = require('express')
const { catchErrors } = require('../utils/errorHandlers')
const { isLoggedIn } = require('../services/auth')

const {
  upload,
  resize,
  addFinca,
  getFincas,
  getFinca,
  newFinca
} = require('../services/fincas')

const router = express.Router()

router.get('/', catchErrors(getFincas))
router.get('/ubicacion/:location', catchErrors(getFincas))
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