const assert = require('chai').assert
const expect = require('chai').expect
const IsAMatchingFeed = require('../lib/fire-base.js').syncItemsWithRemoteData

describe('Firebase', () => {
  it('Feeds items should be uniq and orderd by date', () => {
    let fakeLocalItems = [
      {
        content : "this is a content",
        guid: "123456",
        isoDate : "2012-07-14T01:00:00+01:00"
      },
      {
        content : "this is a second content",
        guid: "654321",
        isoDate: "2017-07-14T01:00:00+01:00"
      }
    ]

    let fakeRemoteItems = [
      {
        content : "this is a content",
        guid: "123456",
        isoDate: "2012-07-14T01:00:00+01:00"
      },
      {
        content: "this is a third content",
        guid: "098765",
        isoDate: "2015-07-14T01:00:00+01:00"
      }
    ]

    let expectedData = [
      {
        content : "this is a second content",
        guid: "654321",
        isoDate: "2017-07-14T01:00:00+01:00"
      },
      {
        content: "this is a third content",
        guid: "098765",
        isoDate: "2015-07-14T01:00:00+01:00"
      },
      {
        content : "this is a content",
        guid: "123456",
        isoDate : "2012-07-14T01:00:00+01:00"
      }
    ]

    assert.deepEqual(syncItemsWithRemoteData(fakeRemoteItems, fakeLocalItems), expectedData)
  });

});
