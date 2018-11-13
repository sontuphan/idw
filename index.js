var path = require('path');
var readline = require('readline');
var fs = require('fs');
var consensus = require('./consensus');

const testcase = path.join(__dirname, './test/testcase.json');

var lineReader = readline.createInterface({
  input: fs.createReadStream(testcase)
});

lineReader.on('line', function (line) {
  var data = JSON.parse(line);
  var truth = data[0].decisionR1;

  var from = 1;
  var to = 3;
  var x = (from + to) / 2;
  var SCUT_MID = consensus.SCUT(data, x)
  var STOP = 100;
  while (SCUT_MID.HW != SCUT_MID.NW) {
    STOP--;
    x = (from + to) / 2;
    SCUT_MID = consensus.SCUT(data, x);
    if (SCUT_MID.HW > SCUT_MID.NW) {
      to = x;
    }
    else {
      from = x;
    }
    if (!STOP) break;
  }

  var BC = 0;
  var DC = 0;
  var BDC = 0;
  var MDC = 0;
  var HDC = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].type == 'BC') BC += data[i].power;
    if (data[i].type == 'DC') {
      DC += data[i].power;
      if (data[i].isBribed) BDC += data[i].power;
      else if (data[i].isAttacker) MDC += data[i].power;
      else HDC += data[i].power;
    }
  }

  var ct = 1 / (2 * MDC / DC - 1);
  var cd = 1 / (1 - 2 * BDC / DC);

  if (MDC / DC > 1 / 2 && HDC > 0 && BDC > 0) {
    console.log('truth:', truth);
    console.log('== know ==')
    console.log(`BC = ${BC}, DC = ${DC}`);
    var SCUT1 = consensus.SCUT(data, 1);
    var SCUTx = consensus.SCUT(data, x);
    console.log('SCUT1:', SCUT1);
    console.log('SCUTx:', SCUTx);
    console.log('x:', x);
    console.log('== hidden ==')
    console.log(`BDC = ${BDC}, MDC = ${MDC}, HDC = ${HDC}`);
    console.log('b:', BDC / DC);
    console.log('m:', MDC / DC);
    console.log('h:', HDC / DC);
    console.log('1/(1-2b):', cd);
    console.log('1/(2m-1):', ct);

    console.log('*******************')
  }
});