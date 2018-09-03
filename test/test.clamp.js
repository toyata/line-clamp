let expect = chai.expect
let assert = chai.assert

describe('Text Clamp', function() {
  describe('document.load', function() {
    it('should clamp text', (done) => {
      DOM.ready().then( function() {
        let text = document.getElementById('clamp').textContent
        assert.equal(text, "Within the download you'll find the following directories and files, logically grouping common assets and providing both ...");
      }).then(done).catch(done)
    });
  });
});
