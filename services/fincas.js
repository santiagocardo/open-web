const Finca = require('../models/fincas')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/')
    if(isPhoto) {
      next(null, true)
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false)
    }
  }
}

const upload = multer(multerOptions).array('images')

const resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.files) {
    next() // skip to the next middleware
    return
  }

  req.body.images = []
  for (const file of req.files) {
    const extension = file.mimetype.split('/')[1]
    const image = `${uuid.v4()}.${extension}`
    req.body.images.push(image)
    // now we resize
    const photo = await jimp.read(file.buffer)
    await photo.resize(800, jimp.AUTO)
    await photo.write(`./public/uploads/${image}`)
  }

  // once we have written the images to our filesystem, keep going!
  next()
}

const addFinca = async (req, res) => {
  const existingCode = await Finca.findOne({ code: req.body.code })
  if (existingCode) {
    throw new Error('El codigo de la finca ya existe!')
  }
  const finca = await (new Finca(req.body)).save()
  res.redirect('/fincas')
}

const getFincas = async (req, res) => {
  const page = req.params.page || 1
  const limit = 4
  const skip = (page * limit) - limit

  const fincasPromise = Finca
    .find()
    .skip(skip)
    .limit(limit)
  const countPromise = Finca.count()

  const [fincas, count] = await Promise.all([fincasPromise, countPromise])

  const pages = Math.ceil(count / limit)
  if (!fincas.length && skip) {
    res.redirect(`/fincas`)
    return
  }
  
  res.render('fincas', { path: req.path, fincas, page, pages, count })
}

const getFincasByLocation = async (req, res) => {
  const { location } = req.params
  const page = req.params.page || 1
  const limit = 2
  const skip = (page * limit) - limit

  const fincasPromise = Finca
    .find({ location })
    .skip(skip)
    .limit(limit)
  const countPromise = Finca.count({ location })

  const [fincas, count] = await Promise.all([fincasPromise, countPromise])

  const pages = Math.ceil(count / limit)
  if (!fincas.length && skip) {
    res.redirect(`/fincas/${location}`)
    return
  }
  
  res.render('fincas', { path: req.path, fincas, page, pages, count, location })
}

const getRandomFincas = async (req, res) => {
  const foundFincas = await Finca.find()
  const fincas = []
  for (let i = 0; i < 3; i++) {
    fincas.push(foundFincas[Math.floor(Math.random() * foundFincas.length)])
  }

  res.render('home', { fincas })
}

const getFinca = async (req, res) => {
  const { code } = req.params
  const finca = await Finca.findOne({ code })
  
  if (!finca) {
    return res.redirect('/fincas')
  }
  
  res.render('finca',  { finca })
}

const newFinca = async (req, res) => {
  res.render('crear-finca')
}

module.exports = {
  upload,
  resize,
  addFinca,
  getFincas,
  getFincasByLocation,
  getRandomFincas,
  getFinca,
  newFinca
}