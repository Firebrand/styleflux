const { assert } = require('chai');
const index = require('../lib/index');


describe('Index - complete integration test', () => {
  it('Open test file and convert to array', () => {
    index.processCSSFile('./test/test.scss');
    const clean = index._readFileContents('./test/test_clean.scss');
    const expected = index._readFileContents('./test/test_expected.scss');


    assert.equal(clean, expected);
  });
});
