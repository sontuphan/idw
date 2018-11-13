var path = require('path');
var fs = require('fs');

var random = {
  integer: function (from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  },
  float: function (from, to) {
    return Math.random() * (to - from) + from;
  },
  boolean: function () {
    return Math.random() >= 0.5;
  },
  winners: function () {
    var x = ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA']
    return x[Math.floor(Math.random() * 6)];
  }
}

var genCoach = function (type, power, decisionR1, decisionR2, isAttacker, isBribed) {
  var coach = {
    type: type,
    power: power,
    decisionR1: decisionR1,
    decisionR2: decisionR2,
    isAttacker: isAttacker,
    isBribed: isBribed
  }
  return coach;
}

const OUTPUT = path.join(__dirname, './testcase.json');
const TIMES = 10000;

for (var t = 0; t < TIMES; t++) {
  var test = []

  // Truth value
  var God = genCoach(
    'GOD',
    0,
    random.boolean(),
    random.winners(),
    false,
    false
  );
  test.push(God);

  // BC
  var BC = genCoach(
    'BC',
    random.integer(0, 5000),
    random.boolean(),
    'ABC',
    random.boolean(),
    false
  );
  if (BC.isAttacker) BC.decisionR1 = false;
  if (!BC.isAttacker) BC.decisionR1 = God.decisionR1;
  test.push(BC);

  // DC
  // In case, bribing attack
  if (BC.isAttacker) {
    var powerDC = 0;
    var powerBDC = 0;
    var b = random.float(0, 1 / 3);
    // Bribed coaches
    for (var i = 0; i < 9; i++) {
      if (random.boolean()) {
        var DC = genCoach(
          'DC',
          random.integer(0, 5000),
          BC.decisionR1,
          'ABC',
          true,
          true
        );
        powerBDC += DC.power;
        test.push(DC);
      }
    }
    // The rest of DC (except bribed coaches)
    powerDC = Math.floor(powerBDC / b);
    while (powerDC > 0) {
      var DC = genCoach(
        'DC',
        random.integer(0, 5000),
        random.boolean(),
        'ABC',
        random.boolean(),
        false
      );
      if (!DC.isAttacker) DC.decisionR1 = God.decisionR1;
      if (DC.isAttacker) DC.decisionR1 = true;
      if (powerDC > DC.power) {
        test.push(DC);
        powerDC -= DC.power;
      }
      else {
        DC.power = powerDC;
        test.push(DC);
        powerDC -= DC.power;
      }
    }
  }
  // In case, no bribing attack
  else {
    for (var i = 0; i < random.integer(1, 15); i++) {
      var DC = genCoach(
        'DC',
        random.integer(0, 5000),
        false,
        'ABC',
        random.boolean(),
        false
      );
      if (!DC.isAttacker) DC.decisionR1 = God.decisionR1;
      if (DC.isAttacker) DC.decisionR1 = true;
      test.push(DC);
    }
  }

  fs.appendFileSync(OUTPUT, JSON.stringify(test) + '\r\n');
}