'use strict'

const User = use('App/Models/User')

class AuthenticationController {

  async login ({ auth, request }) {
    const { email, password } = request.all()
    return await auth.withRefreshToken().attempt(email, password)
  }

  async register ({ auth, request }) {
    const userInfo = request.post()
    
    await User.create(userInfo)

    return await auth.withRefreshToken().attempt(userInfo.email, userInfo.password)
  }

  async logout ({ auth }) {
    const token = auth.getAuthHeader()
    await auth.current.revokeTokens([token], true)
    return { data: 'Logout successfully.' }
  }
}

module.exports = AuthenticationController
