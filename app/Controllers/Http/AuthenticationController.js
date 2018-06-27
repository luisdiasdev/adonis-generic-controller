'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')
const ValidationException = use('App/Exceptions/ValidationException')

class AuthenticationController {

  async login ({ auth, request }) {
    const { email, password } = request.all()
    return await auth.withRefreshToken().attempt(email, password)
  }

  async register ({ auth, request }) {
    const userInfo = request.post()
    const validation = await validateAll(userInfo, {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required'
    })

    if (validation.fails()) {
      throw new ValidationException(validation.messages())
    }
    
    await User.create(userInfo)

    return await auth.withRefreshToken().attempt(userInfo.email, userInfo.password)
  }

  async logout ({ auth, response }) {
    const token = auth.getAuthHeader()
    await auth.current.revokeTokens([token], true)
    return { data: 'Logout successfully.' }
  }
}

module.exports = AuthenticationController
