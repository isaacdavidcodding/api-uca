const app = require('express')()
const consign = require('consign')
const db = require('./config/db')
const mongoose = require('mongoose')

const hostname = '127.0.0.1'
const port = 3000

app.db = db
app.mongoose = mongoose

consign()
  .include('./config/passport.js')
  .include('./config/middlewares.js')
  .include('./api/validation.js')
  .include('./api')
  .include('./config/routes.js')
  .into(app)

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
