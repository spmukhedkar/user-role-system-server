const express = require('express')
const router = new express.Router()
const userCtrl = require('../controller/user')
const { auth, adminAuth } = require('../middleware/auth')

// internal function
const displayUser = (user) => {
  const userObj = user.toObject()
  delete userObj.tokens
  delete userObj.password
  return userObj
}

/**
 * @swagger
 *
 * /users/signup:
 *  post:
 *      summary: create a user
 *      description: signup a user. The default authorize status is false
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          userName:
 *                              type: string
 *                              description: username
 *                          email:
 *                              type: string
 *                              description: email address for a user
 *                          password:
 *                              type: string
 *                              description: password
 *                          authorize:
 *                              type: Boolean
 *                              description: is it authorize.
 *                              default: false
 *                          mobileNumber:
 *                              type: string
 *                              description: a valid 10 digit mobile number
 *                          userRoles:
 *                              type: objectId
 *                              description: user roles
 *      responses:
 *          201:
 *              description: User Saved Successfully
 *          422:
 *              error in creating user
 *          401:
 *              descriptions: Authentication is required
 */

router.post('/signup', async (req, res) => {
  try {
    const user = await userCtrl.saveUserLogin(req.body)
    res.status(201).send({
      message: 'User Saved Successfully',
      user: displayUser(user),
      token: user.tokens.slice(-1).pop().token
    })
  } catch (e) {
    console.log({ Error: e })
    res.status(422).send(e)
  }
})

/**
 * @swagger
 *
 * /users/signin:
 *  post:
 *      summary: sign in authorize user
 *      description: An authorize user can sign in
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          userName:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: User logged in Successfully
 *          401:
 *              user is not authenticated
 *
 */
router.post('/signin', async (req, res) => {
  try {
    if (!(req.body.userName && req.body.password)) {
      res.status(401).send({
        message: 'Missing parameters'
      })
    } else {
      const user = await userCtrl.loginUser(
        req.body.userName,
        req.body.password
      )
      res.status(200).send({
        message: 'User sign in successfully',
        user: displayUser(user),
        token: user.tokens.slice(-1).pop().token
      })
    }
  } catch (e) {
    console.log({ Error: e })
    res.status(403).send({ error: e.message })
  }
})

/**
 * @SwaggerDefinition(
  securityDefinition = @SecurityDefinition(
    apiKeyAuthDefinitions = {
      @ApiKeyAuthDefinition(key = "user", name = "Authorization", in = ApiKeyLocation.HEADER)
    }
  )
)
 */

/**
 * @swagger
 *
 * /users/signout:
 *  post:
 *      summary: signout a logged in user
 *      description: signout a logged in user
 *      security:
            api_key: #/securityDefinition/ApiKeyAuthDefinition
 *      responses:
 *          200:
 *              description: User logged in Successfully
 *          401:
 *              user is not authenticated
 *
 */
router.post('/signout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => {
      return t.token !== req.token
    })

    await userCtrl.saveUser(req.user)

    res.send({
      message: 'Signout Successful'
    })
  } catch (e) {
    console.log({ Error: e })
    res.status(401).send({ error: e.message })
  }
})

/**
 * @swagger
 *
 * /users/getUsersByAuthType:
 *  get:
 *      summary: Get a list of users by Authorize type
 *      description: Get a list of users by Authorize type. Authorize types are true, false or all
 *      parameters:
 *          - in: query
 *            name: authType
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *          201:
 *              description: UserCount and list of users
 *          400:
 *              error in fetching list of users
 */
router.get('/getUsersByAuthType', auth, adminAuth, async (req, res) => {
  try {
    const allUsers = await userCtrl.getUsersByAuthType(req.query.authType)
    const response = {
      count: allUsers.length,
      allUsers
    }
    res.status(200).send(response)
  } catch (e) {
    console.log({ Error: e })
    res.status(400).send({ error: e.message })
  }
})

/**
 * @swagger
 *
 * /users/changeAuthorizeStatus:
 *  post:
 *      summary: change authorize status.
 *      description: Only admin can perform this action
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          userId:
 *                              type: string
 *                          authorize:
 *                              type: boolean
 *      security:
            api_key: #/securityDefinition/ApiKeyAuthDefinition
 *      responses:
 *          200:
 *              description: Uthorize status is changed successfully
 *          401:
 *              user is not authenticated
 *          400:
 *              error in performing the action
 */
router.post('/changeAuthorizeStatus', auth, adminAuth, async (req, res) => {
  try {
    if (!(req.body.authorize && req.body.userId)) {
      res.status(401).send({
        message: 'Missing parameters'
      })
    } else {
      await userCtrl.changeAuthStatus(req.body.userId, req.body.authorize)
      res.status(200).send({
        message: 'authorize status is changed successfully'
      })
    }
  } catch (e) {
    console.log({ Error: e })
    res.status(401).send({ error: e.message })
  }
})

module.exports = router
