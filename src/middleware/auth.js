// require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../controller/user')
const Role = require('../controller/roles')

const auth = async (req, res, next) => {
  try {
    // get the token
    const token = req.header('Authorization').replace('Bearer ', '')
    // verify the token
    const decode = jwt.verify(token, process.env.SECRET_KEY)
    // find the actual user
    const user = await User.findUser(decode.id, token)
    if (!user) {
      throw new Error('User not found')
    }

    req.token = token
    req.user = user

    next()
  } catch (e) {
    console.log({ Error: e })
    if (e.name === 'TokenExpiredError') {
      res.status(401).send({ error: 'Token Expired. Please login Again' })
    } else {
      res.status(401).send({ error: 'Please authenticate' })
    }
  }
}

const adminAuth = async (req, res, next) => {
  try {
    const adminRoleId = await Role.findbyName('Administrator')
    const user = req.user
    if (!user.userRoles.includes(adminRoleId[0].id)) {
      throw new Error('User does not have permission for this operation')
    }
    next()
  } catch (e) {
    console.log({ Error: e })
    res.status(400).send({ error: 'You are not admin user' })
  }
}

module.exports = { auth, adminAuth }
