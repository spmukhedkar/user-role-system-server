require('dotenv').config()
global.db = require('./lib/mongoose')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const userRouter = require('./routes/user')
const roleRouter = require('./routes/role')

const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const apiName = path.join(__dirname, '/routes/*.js')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'user role system API',
      description: 'Creating Restful API for a user role system',
      version: '1.0.0'
    }
  },
  // path to the API Docs
  // apis: ['./routes/role.js', './routes/user.js']
  apis: [apiName]
}

const swaggerSpec = swaggerJsDoc(options)

const app = express()

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// add header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

// Routers
app.use('/api/v2/users', userRouter)
app.use('/api/v2/roles', roleRouter)
// For swagger Docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running at port ${process.env.APP_PORT}`)
})
