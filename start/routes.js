'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

const withApiPrefix = group => {
  group.prefix('api')
  return group
}

const withJson = group => {
  group.formats(['json'])
  return group
}

const withGenericSearch = group => {
  group.middleware(['genericSearch'])
  return group
}

const withUserAuthenticated = group => {
  group.middleware(['auth:jwt', 'userAuthenticated'])
  return group
}

const apiWithJson = group => withApiPrefix(withJson(group))
const genericSearchAndUserAuthenticated = group => withGenericSearch(withUserAuthenticated(group))

apiWithJson(
  Route.group(() => {
    Route.post('register', 'AuthenticationController.register').validator('UserValidator')
    Route.post('login', 'AuthenticationController.login')
  })
)

apiWithJson(
genericSearchAndUserAuthenticated(
  Route.group(() => {
    Route.get('users', 'UserController.index')
    Route.get('users', 'UserController.show')
    Route.put('users', 'UserController.update').validator('UserValidator')

    Route.get('logout', 'AuthenticationController.logout')
  })
))