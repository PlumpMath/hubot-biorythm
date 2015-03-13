var bioMessages = require(__dirname + '/../data/biorythm.json');

var QUOTIENT = {
      physical: 23,
      emotion: 28,
      intellect: 33
    };

var STEPS = {
      physical:  [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      emotion:   [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1],
      intellect: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1]
    };

var dateFromYYYYMMDD = function (date) {
  return new Date([
               date.substr(0,4),
               date.substr(4,2),
               date.substr(6,2)
             ].join('-'));
};

var diffDays = function (birthday, date) {
    birthday = birthday.toString();

    if (birthday.length !== 8) {
      return null;
    }

    try {
      if (date) {
        date = dateFromYYYYMMDD(date);
      } else {
        date = new Date();
      }

      birthday = dateFromYYYYMMDD(birthday);

      var timeDiffs = Math.abs(birthday.getTime() - date.getTime()),
          dayDiffs = Math.ceil(timeDiffs / (1000 * 60 * 60 * 24));

      return dayDiffs;      
    } catch (e) {
      return null;
    }
};

var calcBioValue = function(quotientValue, dayDiffs) {
  return Math.sin((dayDiffs / quotientValue) * 2 * 3.141592654) * 100;
};

var calcBioStep = function(quotientType, value) {
  var step = Math.round(Math.abs(value) / 10.0);

  if (STEPS[quotientType][step]) {
    return step;
  } else {
    return step - 1;
  }
};

var getBioValues = function(birthday, date) {
  var quotientValues = {},
      quotientValuesYesterday = {},
      dayDiffs = diffDays(birthday);
      dayDiffsYesterday = diffDays(birthday - 1);

  if (!dayDiffs) {
    return null;
  }

  for (var key in QUOTIENT) {
    quotientValues[key] = Math.round(calcBioValue(QUOTIENT[key], dayDiffs));
    quotientValuesYesterday[key] = Math.round(calcBioValue(QUOTIENT[key], dayDiffsYesterday));
  }

  return {
    today: quotientValues,
    yesterday: quotientValuesYesterday
  };
};

var getBioCode = function(birthday, date) {
  var bioCodes = {};
      bioPhases = {};
      bioValues = getBioValues(birthday, date);

  if (!bioValues) {
    return null;
  }

  for (var key in QUOTIENT) {
    var signFlag = bioValues.today[key] - bioValues.yesterday[key] > 0 ? 'U' : 'D',
        phaseFlag = bioValues.today[key] > 0 ? 'P' : 'M',
        rythmStep = calcBioStep(key, bioValues.today[key]);

    if (rythmStep === 10) {
      if ((signFlag === 'U' && phaseFlag === 'P') ||
          (signFlag === 'D' && phaseFlag === 'M')) {
        phaseFlag = 'C';
        rythmStep = 0;
      }
    } else if (rythmStep === 0) {
      phaseFlag = 'C';
    }

    bioCodes[key] = signFlag + phaseFlag + rythmStep.toString();
    bioPhases[key] = phaseFlag;
  }

  bioCodes.summary = bioPhases.physical + bioPhases.emotion + bioPhases.intellect;

  return bioCodes;
};

var getBioMessage = function(birthday, date) {
  var messages = {},
      bioCodes = getBioCode(birthday, date);

  if (!bioCodes) {
    return null;
  }

  for (var key in bioCodes) {
    messages[key] = bioMessages[key][bioCodes[key]];
  }

  return messages;
};

module.exports = {
  getBioMessage: getBioMessage
};
