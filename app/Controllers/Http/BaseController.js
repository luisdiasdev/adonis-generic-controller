'use strict'

const ResourceNotFoundException = use('App/Exceptions/ResourceNotFoundException')
const ValidationException = use('App/Exceptions/ValidationException')
const { validateAll } = use('Validator')

class BaseController {

  constructor (model, options) {
    this.model = model
    this.rules = options.rules || {}
    this.onUpdateIgnoredFields = options.onUpdateIgnoredFields || []
    this.relations = options.relations || []
    this.possibleSortDirections = ['asc', 'desc']
    this.defaultSort = { sort: 'id' , direction: 'asc' }
  }

  async validate (entity) {
    return await validateAll(entity, this.rules)
  }

  getPageable (request) {
    const page = request.get()['page']
    const size = request.get()['size']
    return page && size ? { page, size } : null
  }

  getSortable (request) {
    const sort = request.get()['sort']
    const direction = request.get()['direction']
    const isDirectionValid = this.possibleSortDirections.includes(direction)
    return isDirectionValid && direction && sort ?
      { sort, direction } :
      this.defaultSort
  }

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

  async show ({ params }) {
    const entity = await this.model.find(params.id)

    if (!entity) {
      throw new ResourceNotFoundException()
    }
    
    return entity
  }

  async store ({ request }) {
    const entity = request.post()
    const validation = await this.validate(entity)

    if (validation.fails()) {
      throw new ValidationException(validation.messages())
    }

    return await this.model.create(entity)
  }

  async update ({ params, request }) {
    const entityInfo = request.except(this.onUpdateIgnoredFields)
    const validation = await this.validate(entityInfo)
    const entity = await this.model.find(params.id)

    if (!entity) {
      throw new ResourceNotFoundException()
    }

    if (validation.fails()) {
      throw new ValidationException(validation.messages())
    }

    entity.merge(entityInfo)
    await entity.save()
    return entity
  }

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
