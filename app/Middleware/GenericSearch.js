'use strict'

const SearchProcessor = use('App/Processors/SearchProcessor')

class GenericSearch {

  constructor () {
    this.regex = /(START|AND|OR)\s(\w+)(<:|>:|<|>|\?|:|!:)([^\s&]+)/g
  }
  
  async handle ({ request }, next) {
    if (request && request.get()['search']) {
      const search = request.get()['search']
      const predicates = []
      let result = []

      while ((result = this.regex.exec(search))) {
        const operation = result[1];
        const property = result[2]
        const operator = result[3]
        const value = result[4]

        predicates.push({
          operation,
          property,
          operator: SearchProcessor.preProcessOperator(operator),
          value
        })
      }

      if (predicates && predicates.length > 0) {
        request.predicates = predicates
        request.applyPredicates = (predicates, query) => {
          predicates.forEach(predicate => SearchProcessor.processOperation(predicate, query))
        }
      }
    }
    await next()
  }
}

module.exports = GenericSearch
