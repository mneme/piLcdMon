var wpi = require('wiring-pi');
    lcd = require('./lcd'),
    helpers = require('../helpers/general'),
    _ = require('lodash'),
    q = require('q');

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
  return wiring()
    .then(function(){
      return run(lcd.up);
    })
    .then(function(){
      console.log('setup done');
    });
}

function down(){
  return run(lcd.down);
}

function display(n){
 
}
