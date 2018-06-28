'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class UserValidator extends BaseValidator {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required'
    }
  }
}

module.exports = UserValidator
