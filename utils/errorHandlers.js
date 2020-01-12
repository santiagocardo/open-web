function catchErrors (fn) {
  return function(req, res, next) {
    return fn(req, res, next).catch(next)
  }
}

function notFound (req, res, next) {
  const err = new Error('Oops! Página no encontrada!')
  err.status = 404
  next(err)
}

function developmentErrors (err, req, res, next) {
  err.stack = err.stack || ''
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  }
  res.status(err.status || 500)
  res.format({
    // Based on the `Accept` http header
    'text/html': () => {
      res.render('error', errorDetails)
    }, // Form Submit, Reload the page
    'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
  })
}

function productionErrors (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
}

module.exports = {
  catchErrors,
  notFound,
  developmentErrors,
  productionErrors
}