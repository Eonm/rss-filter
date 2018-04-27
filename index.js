const _ = require('lodash')
const Rx = require('rxjs/Rx')
const program = require('commander')

const Db = require('./lib/fire-base.js').Db
const store = require('./lib/fire-base.js').store
const getProviderData = require('./lib/providers.js').getProviderData
const getAllSources = require('./lib/providers.js').getAllSources
const IsAMatchingFeed = require('./lib/processFeed').IsAMatchingFeed
const safeFilters = require('./lib/processFeed').safeFilters

program
  .version('0.1.0')
  .option('-d, --database-url <url>', 'Set database URL')
  .option('-i, --interval <interval>', 'Set interval in ms')
  .option('-k, --key <key>', 'Firestore api key')
  .option('-s, --safe-regex', 'Prevent regex catastrophic backtracking')
  .parse(process.argv);

if ((program.databaseUrl) && (program.key)) {
  let feedMatcher = new IsAMatchingFeed()

  interval = program.interval || 600000 //10 minutes

  db = new Db(program.key, program.databaseUrl)

  RssParser = function (key, val) {
    let newObjId = key
    let newObj = val

    let filters = program.safeRegex? safeFilters(newObj.filters) : newObj.filters
    let searchSpaces = newObj.searchSpaces
    let providers = newObj.providers

    processor.subscribe(
    	function (feeds) {
        if (!providers.includes(feeds.feedUrl)) return
        let clonnedFeed = _.cloneDeep(feeds)
        // console.log('cloneDeep')
        // if (obj[newObjId].lastFeed) {
        //   clonnedFeed.items = _.takeRightWhile(clonnedFeed.items, function(o) { return !obj[newObjId].lastFeed });// eviter les duplicats
        // }
        clonnedFeed.items = clonnedFeed.items.filter(
          function (feed) {
          return feedMatcher.filter(filters,searchSpaces)(feed)
        })

        console.log('--------------------------------------')
        console.log(`${ feeds.feedUrl} (${newObjId }) ${clonnedFeed.items.length} matching feeds founded  filters = [${newObj.filters}]`)

        db.updateProcessorFeeds(newObjId, feeds.feedUrl , clonnedFeed)
      },
    	function (err) { console.log('subscriber onError')},
    	function () { console.log('subscriber done')}
    )
  }

  let source = Rx.Observable.fromEvent(
    store,
    'data-updated',
    function (x) {
      return  x
    }
  )

  subscription = source.subscribe(
    function (watchers) {
      x = getAllSources(watchers)
      let sources = Rx.Observable.from(x)

      RssFeeds = Rx.Observable.timer(0, interval)
        .mergeMap(int => {
        return sources.flatMap(source => {
          return Rx.Observable.fromPromise(getProviderData(source))
          .catch(error => {
            console.log
            return Rx.Observable.empty() //prevent error to kill Observable and subscribers
          })
        }).catch((err) => {
          return Rx.Observable.empty()
        })
      })

      processor = new Rx.Subject()

      RssFeeds.subscribe(processor)
      _.forEach(watchers, function(value, key) {
        new RssParser(key, value)
      })
    },
    function (err) {
    },
    function () {
    }
  )
} else {
  console.log('You need to provide at least a database URL and an API key.')
}
