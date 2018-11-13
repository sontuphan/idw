var path = require('path');
var readline = require('readline');
var fs = require('fs');

const testcase = path.join(__dirname, './testcase.json');

var lineReader = readline.createInterface({
  input: fs.createReadStream(testcase)
});

lineReader.on('line', function (line) {
  var data = JSON.parse(line);
  var BC = 0;
  var DC = 0;
  var BDC = 0;
  var MDC = 0;
  var HDC = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].type == 'GOD') return;
    else if (data[i].type == 'BC') BC += data[i].power;
    else if (data[i].type == 'DC') {
      DC += data[i].power;
      if (data[i].isBribed) BDC += data[i].power;
      else if (data[i].isAttacker) MDC += data[i].power;
      else HDC += data[i].power;
    }
    else console.log('********* Fail *********');
  }
  if (DC != BDC + MDC + HDC) console.log('********* Fail *********:');
  var b = BDC / DC;
  var m = MDC / DC;

  if (b > 1 / 3 || b < 0) console.log('********* Fail *********:');
  if (m > 1 || m < 0) console.log('********* Fail *********:');
});
