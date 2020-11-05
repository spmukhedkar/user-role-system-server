const express = require('express')
const router = new express.Router()
const roleCtrl = require('../controller/roles')
const { auth, adminAuth } = require('../middleware/auth')

/**
 * @swagger
 * /roles/getAllRoles:
 *  get:
 *    description: Get All Roles
 *    responses:
 *      200:
 *        description: A successful response
 *      400:
 *        descriptions: An error response
 *      401:
 *        descriptions: Authentication is required
 */
router.get('/getAllRoles', auth, adminAuth, async (req, res) => {
  try {
    const roles = await roleCtrl.getAllRoles()
    const response = {
      count: roles.length,
      roles
    }
    res.status(200).send(response)
  } catch (e) {
    console.log({ Error: e })
    res.status(400).send(e)
  }
})

/**
 * @swagger
 *
 * /roles/createRole:
 *  post:
 *      summary: create a role
 *      description: create a unique role using names
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: name of a role
 *      responses:
 *          201:
 *              description: role created successfully
 *          422:
 *              error in creating role
 */
router.post('/createRole', auth, adminAuth, async (req, res) => {
  try {
    const role = await roleCtrl.saveRole(req.body)
    res.status(201).send({
      message: 'Role Saved Successfully',
      user: role
    })
  } catch (e) {
    console.log({ Error: e })
    res.status(422).send(e)
  }
})

module.exports = router
