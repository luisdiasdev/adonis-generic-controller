'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ResourceNotFoundException extends LogicalException {

  handle (_, { response }) {
    response.notFound({ data: 'Resource not found.' })
  }
}

module.exports = ResourceNotFoundException
