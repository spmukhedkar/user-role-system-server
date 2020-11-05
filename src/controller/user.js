const userModel = require('../models/user')

/**
 * Save user login data
 */
const saveUserLogin = async (data) => await userModel.saveNewLogin(data)

const loginUser = async (userName, password) =>
  await userModel.loginUser(userName, password)

const saveUser = async (user) => await userModel.saveUser(user)

const findUser = async (id, token) => await userModel.findUser(id, token)

const getUsersByAuthType = async (authType) => {
  if (authType === 'all') {
    return await userModel.getAllUsers()
  } else {
    return await userModel.getUsersByAuthType(
      authType === 'true'
    )
  }
}

const changeAuthStatus = async (userId, authorize) =>
  await userModel.changeAuthStatus(userId, authorize)

module.exports = {
  saveUserLogin,
  loginUser,
  saveUser,
  findUser,
  getUsersByAuthType,
  changeAuthStatus
}
