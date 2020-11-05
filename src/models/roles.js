// const mongoose = require('mongoose')
const { Role } = require('../schema/roles')

/**
 * Get all roles
 */
const getAllRoles = async () =>
  Role.aggregate([
    {
      $project: {
        _id: 0,
        id: '$_id',
        name: 1
      }
    }
  ]).exec()

// get role by
const findbyName = async (name) =>
  Role.aggregate([
    {
      $match: {
        name: name
      }
    },
    {
      $project: {
        _id: 0,
        id: '$_id'
      }
    }
  ]).exec()

const saveRole = async (data) => {
  const newRole = new Role(data)
  return await newRole.save()
}

module.exports = { getAllRoles, saveRole, findbyName }
