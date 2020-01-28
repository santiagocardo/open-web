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
  const { location } = req.params
  const fincas = await Finca.find(location ? { location } : {})
  
  res.render('fincas', { path: req.path, fincas })
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
  getFinca,
  newFinca
}