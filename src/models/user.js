const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { UserLogin } = require('../schema/userLogin')
// const userLogin = require('../schema/userLogin');

const saveUser = async (user) => {
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  return await user.save()
}

const findUser = async (decodeId, token) =>
  await UserLogin.findOne({
    _id: mongoose.Types.ObjectId(decodeId),
    'tokens.token': token
  })

const saveNewLogin = async (data) => {
  const userLogin = new UserLogin(data)
  return generateTokens(userLogin)
}

const loginUser = async (userName, password) => {
  const userLogin = await UserLogin.findOne({ userName, authorize: true })
  if (!userLogin) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, userLogin.password)
  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return generateTokens(userLogin)
}

const getUsersByAuthType = async (authType) =>
  UserLogin.aggregate([
    { $match: { authorize: authType } },
    {
      $project: {
        _id: 0,
        id: '$_id',
        userName: 1,
        email: 1,
        mobileNumber: 1,
        authorize: 1
      }
    }
  ]).exec()

const getAllUsers = async () =>
  UserLogin.aggregate([
    {
      $project: {
        _id: 0,
        id: '$_id',
        userName: 1,
        email: 1,
        mobileNumber: 1,
        authorize: 1
      }
    }
  ]).exec()

const changeAuthStatus = async (userId, authorize) => {
  const userLogin = await UserLogin.findById(mongoose.Types.ObjectId(userId))
  // await UserLogin.findbyId(mongoose.Types.ObjectId(userId))

  userLogin.authorize = authorize === 'true'
  await saveUser(userLogin)
}

/**
 * internal method to generateTokens
 */
const generateTokens = async (userLogin) => {
  const token = jwt.sign(
    { id: userLogin._id.toString() },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  )
  userLogin.tokens = userLogin.tokens.concat({ token })
  return saveUser(userLogin)
}

module.exports = {
  findUser,
  saveUser,
  saveNewLogin,
  loginUser,
  getUsersByAuthType,
  getAllUsers,
  changeAuthStatus
}
