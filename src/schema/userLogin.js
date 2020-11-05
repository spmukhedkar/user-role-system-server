const mongoose = require('mongoose')
const validator = require('validator')

// userLogin Schema
const userLogin = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      maxlength: 100,
      unique: true
    },
    email: {
      type: String,
      required: true,
      maxlength: 255,
      validate (value) {
        if (!validator.isEmail(value)) {
          throw new Error('Please enter valid email address')
        }
      }
    },
    password: {
      type: String,
      required: true,
      maxlength: 100
    },
    authorize: {
      type: Boolean,
      required: true,
      default: false
    },
    mobileNumber: {
      type: String,
      required: true,
      maxlength: 20,
      validate (value) {
        if (!validator.isMobilePhone(value, 'en-IN')) {
          throw new Error('Please enter valid mobile number')
        }
      }
    },
    userRoles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles',
        required: true
      }
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

const UserLogin = mongoose.model('UserLogin', userLogin)

module.exports = { UserLogin }
