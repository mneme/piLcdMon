var path = require('path'),
    fs = require('fs'),
    _ = require('lodash');

function read (filepath) {
  return require(path.resolve(__dirname, filepath));
};


var base = read('./base.json');
var ohw = read('./openHardwareMonitor.json');

module.exports = exports = _.merge({}, base, {ohw: ohw});
