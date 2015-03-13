var nodeunit = require('nodeunit');

var path = require('path'),
    biorythm = require(path.resolve('libs', 'biorythm'));

var testBirtyday = "19780729",
    testDate = "20151225";

exports['biorythm library'] = nodeunit.testCase({
  'Get biorythm messages': function (test) {
    var messages = biorythm.getBioMessage(testBirtyday);

    test.equal(typeof messages.summary, 'string');
    test.equal(typeof messages.physical, 'string');
    test.equal(typeof messages.emotion, 'string');
    test.equal(typeof messages.intellect, 'string');
    test.done();
  },

  'Get biorythm messages with specific date': function (test) {
    var messages = biorythm.getBioMessage(testBirtyday, testDate);

    test.equal(typeof messages.summary, 'string');
    test.equal(typeof messages.physical, 'string');
    test.equal(typeof messages.emotion, 'string');
    test.equal(typeof messages.intellect, 'string');
    test.done();
  },
});
