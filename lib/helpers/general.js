var q = require('q');

exports.delay = delay;

function delay(ms){
  var def = q.defer();
  setTimeout(function(){
    def.resolve();
  }, ms)
  return def.promise;
}