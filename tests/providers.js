const assert = require('chai').assert
const getAllSources = require('../lib/providers.js').getAllSources

describe('Providers', () => {
  it('Should be uniq', () => {

    let fakeWatchersObj = [
      {'providers': ['https://www.example.com', 'https://www.example.com']},
      {'providers': ['https://www.example.com']}
    ]

    assert.deepEqual(getAllSources(fakeWatchersObj), ['https://www.example.com'])

  });
  it('Should get all providers', () => {

    let fakeWatchersObj = [
      {'providers': ['https://www.example.com', 'https://www.example1.com']},
      {'providers': ['https://www.example2.com']}
    ]

    assert.deepEqual(getAllSources(fakeWatchersObj), ['https://www.example.com', 'https://www.example1.com', 'https://www.example2.com'])

  });
});
