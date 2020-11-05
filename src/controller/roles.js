const roleModel = require('../models/roles')

const getAllRoles = async () => await roleModel.getAllRoles()

const saveRole = async (data) => await roleModel.saveRole(data)

const findbyName = async (name) => await roleModel.findbyName(name)

module.exports = {
  getAllRoles,
  saveRole,
  findbyName
}
