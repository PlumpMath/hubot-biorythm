/**
 * Description:
 *   Hubot Biorythm
 *
 * Commands:
 *   hubot biorythm birthday (YYYYMMDD)
 *   hubot biorythm birthday targetdate
 *
 * Author:
 *   @golbin
 */

var path = require('path'),
    biorythm = require(path.join(__dirname, '/libs/biorythm'));

var sectionName = {
      summary: '총평',
      physical: '신체',
      emotion: '감성',
      intellect: '지성'
    };

var sectionOrder = ['physical', 'emotion', 'intellect', 'summary'];

module.exports = function(robot) {
  robot.respond(/biorythm(\s*([0-9\s]*))/i, function(msg) {
    if (!msg.match[2]) {
      msg.send('biorythm birthday (YYYYMMDD) | biorythm birthday targetdate');
      return;
    }

    var messages = {},
        date = msg.match[2].split(/\s+/);

    if (date.length < 1 ||
        date[0].length !== 8) {
      msg.send('biorythm birthday (YYYYMMDD) | biorythm birthday targetdate');
      return;
    }

    messages = biorythm.getBioMessage(date[0], date[1]);

    if (!messages) {
      msg.send('생일과 바이오리듬을 보려는 날짜를 YYYYMMDD 형태로 정확히 입력해주세요.');
      return;
    }

    var message = sectionOrder.reduce(function(msg, section) {
      msg = msg + sectionName[section] + ': ' + messages[section] + '\n';
      return msg;
    }, '');

    msg.send(message);
  });
};
