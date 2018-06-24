'use strict'

class UserAuthenticated {
  async handle ({ auth, response }, next) {
    try {
      await auth.check()
    } catch (error) {
      return response.unauthorized({ data: 'Permission denied.' })
    }

    await next()
  }
}

module.exports = UserAuthenticated
