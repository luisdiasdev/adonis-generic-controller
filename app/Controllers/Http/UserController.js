'use strict'

const BaseController = use('App/Controllers/Http/BaseController')

class UserController extends BaseController {

  constructor () {
    super(use('App/Models/User'), {
      // The fields to ignore when updating an entity
      onUpdateIgnoredFields: ['id', 'username', 'email']
      // Optionally we could have the relations property
      // which tells our controller which relationships
      // we want to fetch together with our entity.
      // relations: ['accounts', 'addresses']
    })
  }
}

module.exports = UserController
