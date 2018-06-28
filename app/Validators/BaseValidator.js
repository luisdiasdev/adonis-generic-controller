'use strict'

class BaseValidator {
  async fails (errorMessages) {
    return this.ctx.response.badRequest(errorMessages)
  }
}

module.exports = BaseValidator
