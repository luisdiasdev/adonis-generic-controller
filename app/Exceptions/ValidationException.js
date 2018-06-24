'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ValidationException extends LogicalException {

  handle (error, { response }) {
    response.badRequest(error.message)
  }
}

module.exports = ValidationException
