const fetch = require('node-fetch')
const _ = require('lodash')
const Parser = require('rss-parser');
const parser = new Parser()

const getProviderData = (feedUrl) => {
  console.log(`fetching ${feedUrl}`)
  return fetch(feedUrl)
    .then(resp =>  {
      console.log('fetched')
      return resp.text()
  })
  .then(feeds => {
    return parser.parseString(feeds)
  }).catch((err) => {
    console.log(`Can't fetch ${feedUrl}`)
    throw `Can't fetch ${feedUrl} `
  })
}

const getAllSources = (watchersObj) => {

  let sources = _(watchersObj).values().map(value => {
    return value['providers']
  })
  .compact()
  .flatMap()
  .uniq()
  .value()

  return sources
}

module.exports = {
  getProviderData,
  getAllSources
}
