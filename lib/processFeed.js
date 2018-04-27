const safeRegex = require('safe-regex')
const _ = require('lodash')

function IsAMatchingFeed () {
  this.filter = (filters, searchSpaces) => {
    return function (feed) {//cury
      return searchSpaces.some(searchSpace => {
        return filters.some(function (filter, index) {
            if (filter.match(/^\/.*\/$/) ) {
              filter = filter.replace(/^\//, '').replace(/\/$/, '')
              filter = new RegExp(filter,"g")
            }
            if (!feed[searchSpace]) return false
            if(feed[searchSpace].match(filter)) return true
        })
      })
    }
  }
}

safeFilters = (filters) => {
  return filters.map(filter => {
    if (filter.match(/^\/.*\/$/) ) {
      newRegex = filter.replace(/^\//, '').replace(/\/$/, '')
      newRegex = new RegExp(filter,"g")

      if (safeRegex(newRegex) === false) return filter = null
      if (safeRegex(newRegex) === true)  return filter = filter
    }
      return filter
  })
  .filter(elem => {
    return elem != null
  })
}

module.exports = {
  IsAMatchingFeed,
  safeFilters
}
