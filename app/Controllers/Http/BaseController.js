'use strict'

const ResourceNotFoundException = use('App/Exceptions/ResourceNotFoundException')

class BaseController {

  constructor (model, options) {
    this.model = model
    this.rules = options.rules || {}
    this.onUpdateIgnoredFields = options.onUpdateIgnoredFields || []
    this.relations = options.relations || []
    this.possibleSortDirections = ['asc', 'desc']
    this.defaultSort = { sort: 'id' , direction: 'asc' }
  }

  /**
   * Gets the paging information from the request
   * 
   * @param {*} request The request to get the paging from
   */
  getPageable (request) {
    const page = request.get()['page']
    const size = request.get()['size']
    return page && size ? { page, size } : null
  }

  /**
   * Gets the sorting information from the request
   * 
   * @param {*} request The request to get the sorting from
   */
  getSortable (request) {
    const sort = request.get()['sort']
    const direction = request.get()['direction']
    const isDirectionValid = this.possibleSortDirections.includes(direction)
    return isDirectionValid && direction && sort ?
      { sort, direction } :
      this.defaultSort
  }

  /**
   * Lists all the elements of the given model.
   * Applies paging and sorting if the request
   * contains the page and sort strings.
   * Applies search if the request contains the
   * search string.
   * 
   * @param {*} context The HTTP Context
   */
  async index ({ request }) {
    const pageable = this.getPageable(request)
    const sortable = this.getSortable(request)
    const query = this.model.query()

    if (this.relations.length > 0) {
      this.relations.forEach(relation => query.with(relation))
    }

    if (request.predicates) {
      request.applyPredicates(request.predicates, query)
    }

    query.orderBy(sortable.sort, sortable.direction)

    return pageable ? 
      await query.paginate(pageable.page, pageable.size) : 
      await query.fetch()
  }

  /**
   * Gets a single entity with the given id form the
   * database. Returns 404 if the entity was not found.
   * 
   * @param {*} context The HTTP Context 
   */
  async show ({ params }) {
    const entity = await this.model.find(params.id)

    if (!entity) {
      throw new ResourceNotFoundException()
    }
    
    return entity
  }

  /**
   * Saves an entity in the database.
   * Returns the newly created entity.
   * 
   * @param {*} context The HTTP Context 
   */
  async store ({ request }) {
    const entity = request.post()

    return await this.model.create(entity)
  }

  /**
   * Updates an entity with the given id.
   * If the id is not found in the database, returns 404.
   * Otherwise returns the updated entity.
   * 
   * @param {*} context The HTTP Context
   */
  async update ({ params, request }) {
    const entityInfo = request.except(this.onUpdateIgnoredFields)
    const entity = await this.model.find(params.id)

    if (!entity) {
      throw new ResourceNotFoundException()
    }

    entity.merge(entityInfo)
    await entity.save()
    return entity
  }

  /**
   * Deletes an entity with the given id.
   * If the entity was not found, returns 404.
   * Otherwise removes the entity and returns no content.
   * 
   * @param {*} context The HTTP Context 
   */
  async destroy ({ response, params }) {
    const entity = await this.model.find(params.id)

    if (!entity) {
      throw new ResourceNotFoundException()
    }

    await entity.delete()
    return response.noContent()
  }
}

module.exports = BaseController
