var config = require('../../config'),
    _ = require('lodash'),
    EventEmitter = require("events").EventEmitter,
    request = require('request'),
    q = require('q');

var ee = new EventEmitter(),
    running;

module.exports = _.extend(ee, {
  start: start,
  stop: stop
});

function flatten(data, acc){
  acc = acc || [];
  acc[data.id] = _.omit(data, 'Children');
  (data.Children || []).forEach(function(d){
    flatten(d, acc);
  });
  return acc;
}

function camelCaseProperties(obj){
  var ret = {};
  _.keys(obj).forEach(function(key){
    ret[_.camelCase(key)] = obj[key];
  });
  return ret;
}

function stop(){
  clearInterval(running);
}

function start(){
  get()
    .then(function(data){
      running = running || setInterval(start, 1000);
      ee.emit('data', format(data))
    })
    .catch(function(err){
      console.log(err);
    })
}

function format(data){
  return pickProperties(flatten(data).map(function(obj){
    return camelCaseProperties(obj);
  }));
}

function pickProperties(data){
  return _.reduce(_.keys(config.ohw.data),function(obj, key){
    obj[key] = _.omit(data[config.ohw.data[key]], 'imageUrl');
    return obj;
  }, {});
}

function get(){
  var def = q.defer();
  request('http://' + config.ohw.host.ip + ':' + config.ohw.host.port + config.ohw.host.path, function (error, response, body) {
    if (error || response.statusCode !== 200 || !body) {
      return def.reject(error || response.statusCode);
    }
    return def.resolve(JSON.parse(body));
  });
  return def.promise;
}
