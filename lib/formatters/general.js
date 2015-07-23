var str = require('../helpers/string');

exports.getFraction = getFraction;
exports.getPercent = getPercent;
exports.getBar = getBar;
exports.getTemp = getTemp;


function getPercent(data, dec){
  dec = dec || 0;
  return Math.round(parseFloat(data.replace(' %', '').replace(',','.')),0);
}

function getTemp(data, dec){
  return Math.round(parseFloat(data.replace(' °C', '').replace(',','.')),dec);
}

function getFraction(data, dec){
  dec = dec || 0;
  return Math.round(parseFloat(data.replace(' %', '').replace(',','.')),dec)/100
};

function getBar(data, length, full, empty){
  empty = empty || '_';
  full = full || '#';
  length = length || 10;
  var fraction = getFraction(data),
      bar = Array(Math.round(length*fraction)+1).join(full);
  return str.padR(bar, length, empty);
};
 No newline at end of file
