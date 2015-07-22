var config = require('../config'),
    os = require('os');

exports.get = function(){
  var ifaces = os.networkInterfaces();
  return ifaces[config.interface].address;
}