var str = require('../helpers/string');

exports.getFloat = getFloat;
exports.getBar = getBar;

function getFloat(data, dec){
  console.log('trying to parse data: ', data);
  if(!data) return 0;
  dec = dec || 0;
  var d = data.split(' ');
  return Math.round(parseFloat(d[0].replace(',','.')),0);
  return d;
}

function getBar(data, length, full, empty){
  empty = empty || '_';
  full = full || '#';
  length = length || 10;
  var fraction = getFloat(data),
      bar = Array(Math.round(length*fraction)+1).join(full);
  return str.padR(data, bar, length, empty);
};
