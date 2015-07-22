var i2c = require('i2c-bus'),
    lcd = require('./lcd'),
    helpers = require('../helpers/general'),
    _ = require('lodash'),
    q = require('q');

var address = 0x70;

var i2c1 = i2c.openSync(1);

var DISPLAYS = [0,1,2];

exports.up = up;
exports.down = down;
exports.display = display;
exports.write = lcd.write;
exports.reset = lcd.reset;

function run(fun){
  return _.reduce(DISPLAYS, function(prom, n){
    return prom
      .then(function(){
        return display(n);
      })
      .then(function(){
        return fun();
      })
  }, q());
}

function up(){
  return run(lcd.up);
}

function down(){
  return run(lcd.down);
}

function display(n){
  i2c1.writeByteSync(address, 0x04, 0x04 + n)
}
