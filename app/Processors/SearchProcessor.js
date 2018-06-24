'use strict'

class SearchProcessor {
  
  constructor () {
    this.operatorPreProcessor = {
      '?' : 'like',
      '<' : '<',
      '>' : '>',
      '<:' : '<=',
      '>:' : '>=',
      ':' : '=',
      '!:' : '!='
    }
    this.valuePreProcessor = {
      'like' : (predicate) => `%${predicate.value}%`,
      '<' : (predicate) => predicate.value,
      '>' : (predicate) => predicate.value,
      '<=' : (predicate) => predicate.value,
      '>=' : (predicate) => predicate.value,
      '=' : (predicate) => predicate.value,
      '!=' : (predicate) => predicate.value
    }
    this.operationProcessor = {
      'START' : (predicate, query) => query.where(predicate.property, predicate.operator, this.preProcessValue(predicate)),
      'AND' : (predicate, query) => query.andWhere(predicate.property, predicate.operator, this.preProcessValue(predicate)),
      'OR' : (predicate, query) => query.orWhere(predicate.property, predicate.operator, this.preProcessValue(predicate))
    }
  }

  preProcessOperator (operator) {
    return this.operatorPreProcessor[operator]
  }

  preProcessValue (predicate) {
    return this.valuePreProcessor[predicate.operator](predicate)
  }

  processOperation (predicate, query) {
    return this.operationProcessor[predicate.operation](predicate, query) || query
  }
}

module.exports = new SearchProcessor