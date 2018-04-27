const assert = require('chai').assert
const expect = require('chai').expect
const IsAMatchingFeed = require('../lib/processFeed.js').IsAMatchingFeed
const safeFilters = require('../lib/processFeed').safeFilters

describe('Is a matching feed', () => {

  it('Match regex', () => {
    let fakeFeedMatcher = new IsAMatchingFeed({safeRegex: false})

    fakeFilters = ['/test/']
    fakeSearchSpaces = ['content']
    fakeFeed = {
      content: 'test content'
    }

    assert.equal(fakeFeedMatcher.filter(fakeFilters,fakeSearchSpaces)(fakeFeed), true)
  });

  it('Catastrophic backtracking regex are deleted from filters', () => {
    let fakeFeedMatcher = new IsAMatchingFeed()

    fakeFilters = ['/(a+){10}/', '/(a+){10}/']
    assert.deepEqual(safeFilters(fakeFilters), [])

    fakeFilters = ['/(a+){10}/', '/test/']
    assert.deepEqual(safeFilters(fakeFilters), ['/test/'])

    fakeFilters = ['/(a+){10}/', '/test/', 'test2']
    assert.deepEqual(safeFilters(fakeFilters), ['/test/', 'test2'])
  });

  it('Match string', () => {
    let fakeFeedMatcher = new IsAMatchingFeed()

    fakeFilters = ['test']
    fakeSearchSpaces = ['title']
    fakeFeed = {
      title: 'test content'
    }

    assert.equal(fakeFeedMatcher.filter(fakeFilters,fakeSearchSpaces)(fakeFeed), true)
  });

  it('Empty filters return false', () => {
    let fakeFeedMatcher = new IsAMatchingFeed()

    fakeFilters = []
    fakeSearchSpaces = ['title']
    fakeFeed = {
      title: 'test content'
    }

    assert.equal(fakeFeedMatcher.filter(fakeFilters,fakeSearchSpaces)(fakeFeed), false)
  });

  it('Empty content return false', () => {
    let fakeFeedMatcher = new IsAMatchingFeed()

    fakeFilters = ['test']
    fakeSearchSpaces = ['content']
    fakeFeed = {
      title: 'test content'
    }

    assert.equal(fakeFeedMatcher.filter(fakeFilters,fakeSearchSpaces)(fakeFeed), false)
  });

  it('Match searchSpaces', () => {
    let fakeFeedMatcher = new IsAMatchingFeed()

    fakeFilters = ['test']
    fakeSearchSpaces = ['title']
    fakeFeed = {
      title: 'test content'
    }

    assert.equal(fakeFeedMatcher.filter(fakeFilters,fakeSearchSpaces)(fakeFeed), true)

    fakeFilters = ['test']
    fakeSearchSpaces = ['title']
    fakeFeed = {
      content: 'test content'
    }

    assert.equal(fakeFeedMatcher.filter(fakeFilters,fakeSearchSpaces)(fakeFeed), false)

    fakeFilters = ['test']
    fakeSearchSpaces = ['title','content']
    fakeFeed = {
      content: 'test content'
    }

    assert.equal(fakeFeedMatcher.filter(fakeFilters,fakeSearchSpaces)(fakeFeed), true)

  });
});
