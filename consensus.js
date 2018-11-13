var Consensus = function () { };

Consensus.SCUT = function (data, k) {
  var decisionOfBC = 0;
  var BC = 0;
  var DC = 0;
  var NW = 0;
  var HW = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].type == 'BC') {
      decisionOfBC = data[i].decisionR1;
      BC += data[i].power;
    }
    if (data[i].type == 'DC') DC += data[i].power;
  }
  var scut = BC * k / DC;
  for (var i = 0; i < data.length; i++) {
    if (data[i].type == 'BC') {
      if (!data[i].decisionR1) NW += data[i].power;
      if (data[i].decisionR1) HW += data[i].power;
    }
    if (data[i].type == 'DC') {
      if (!data[i].decisionR1) NW += scut * data[i].power;
      if (data[i].decisionR1) HW += scut * data[i].power;
    }
  }
  return {
    decisionOfBC: decisionOfBC,
    BC: BC,
    DC: DC,
    NW: NW,
    HW: HW
  }
}

Consensus.vote = function (scut) {
  if (scut.NW == scut.HW) return scut.decisionOfBC;
  if (scut.NW > scut.HW) return false;
  if (scut.NW < scut.HW) return true;
}

Consensus.R1 = function (data) {
  var SCUT1 = Consensus.SCUT(data, 1);
  // Except BC is not an attacker
  if (SCUT1.decisionOfBC) return true;

  var from = 1;
  var to = 3;
  var mid = (from + to) / 2;
  var SCUT_MID = Consensus.SCUT(data, mid)
  var STOP = 100;
  while (Math.abs(SCUT_MID.HW - SCUT_MID.NW) > 0.00001) {
    STOP--;
    mid = (from + to) / 2;
    SCUT_MID = Consensus.SCUT(data, mid);
    if (SCUT_MID.HW > SCUT_MID.NW) to = mid;
    else from = mid;
    if (!STOP) break;
  }

  var BC = 0;
  for (var i = 0; i < data.length; i++)
    if (data[i].type == 'BC') BC += data[i].power;

  var x = mid;
  var mhz = (1 + x) / (2 * x);
  var coSCUT = JSON.parse(JSON.stringify(SCUT_MID));
  var b = (coSCUT.NW / BC - 1) / x;
  if (Math.abs(mhz + b - 1) < 0.0001) return true;
  else return false;
}

module.exports = Consensus;