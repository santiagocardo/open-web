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

module.exports = {
  upload,
  resize,
  addFinca
}