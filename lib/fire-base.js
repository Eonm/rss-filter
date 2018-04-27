const admin = require('firebase-admin')
const EventEmitter = require('events')
const _ = require('lodash')
const store = new EventEmitter()
cachedWatchers = {}

function Db (serviceAccount, databaseURL) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
  })

  const db = admin.firestore()

  db.collection('watchers').onSnapshot((snapshot) => {
    snapshot.docChanges.forEach((change) => {
      if (change.type === 'added') {
        cachedWatchers[change.doc.id] = change.doc.data()
      } else if (change.type === 'removed') {
        delete cachedWatchers[change.doc.id]
      } else if (change.type === 'modified') {
        cachedWatchers[change.doc.id] = change.doc.data()
      }
    })
    store.emit('data-updated', cachedWatchers)
  })

  this.getWatchers = () => {
    return cachedWatchers
  }

  this.updateWatchers = (id, data) => {
    db.collection('watchers').doc(id).set(data, { merge: true });
  }

  this.updateProcessorFeeds = (id, url ,data) => {
    db.collection('watchers').doc(id).collection('feeds').doc(encodeURIComponent(url)).get().then(remoteData => {
      if (remoteData.data() && remoteData.data().items) {

        data.items = syncItemsWithRemoteData(remoteData.data().items, data.items)
        // feeds = remoteData.data().items.concat(data.items)
        // let uniqFeeds = _.uniqBy(feeds, 'guid');
        // data.items = uniqFeeds
        // data.items = _.sortBy(data.items, function(obj) {return Date.parse(obj.isoDate)}).reverse()
      }

      db.collection('watchers').doc(id).collection('feeds').doc(encodeURIComponent(url)).set(data, { merge: false });
    }).catch((err) => {
      console.log(err)
      // db.collection('watchers').doc(id).collection('feeds').doc(encodeURIComponent(url)).set(data, { merge: false });
    })
  }

  this.writeDB = (data) => {
    return db.collection('watchers').add(data)
  }
}

syncItemsWithRemoteData = (remoteItems, localItems) => {
  feeds = remoteItems.concat(localItems)
  let uniqFeeds = _.uniqBy(feeds, 'guid');
  localItems = uniqFeeds
  localItems = _.sortBy(localItems, function(obj) {return Date.parse(obj.isoDate)}).reverse()

  return localItems
}

module.exports = {
  Db,
  store,
  syncItemsWithRemoteData
}
