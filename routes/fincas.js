const express = require('express')
const { catchErrors } = require('../utils/errorHandlers')
const { isLoggedIn } = require('../services/auth')

const {
  upload,
  resize,
  addFinca,
  getFincas,
  getFincasByLocation,
  getFinca,
  newFinca
} = require('../services/fincas')

const router = express.Router()

router.get('/', catchErrors(getFincas))
router.get('/page/:page', catchErrors(getFincas))
router.get('/ubicacion/:location', catchErrors(getFincasByLocation))
router.get('/ubicacion/:location/page/:page', catchErrors(getFincasByLocation))
router.get('/finca/:code', catchErrors(getFinca))
router.get('/crear', isLoggedIn, catchErrors(newFinca))
router.get('/listar', isLoggedIn, catchErrors(getFincas))
router.get('/listar/page/:page', isLoggedIn, catchErrors(getFincas))
router.get('/listar/:location', isLoggedIn, catchErrors(getFincasByLocation))
router.get('/listar/:location/page/:page', isLoggedIn, catchErrors(getFincasByLocation))

router.post(
  '/add',
  isLoggedIn,
  upload,
  catchErrors(addFinca)
)

module.exports = router