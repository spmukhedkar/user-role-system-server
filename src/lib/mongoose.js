const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

mongoose.Promise = global.Promise
const db = mongoose.connection
mongoose.connection.on('error', () => {
  console.log('Error: Could not connect to DB')
})
mongoose.connection.once('open', () => {
  console.log('Success: Connected to Mongo DB')
})

module.exports = db
