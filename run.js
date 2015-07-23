var ohw = require('./lib/openHardwareMonitor/openHardwareMonitor'),
    str = require('./lib/helpers/string'),
    formatter = require('./lib/formatters/general'),
    lcd = require('./lib/lcd/manager'),
    q = require('q'),
    str = require('./lib/helpers/string');

ohw.on('data', function(data){

  var a = 'c0: ' + formatter.getBar(data.c0.value,16,'Ö','Ä'),
      b = 'c1: ' + formatter.getBar(data.c1.value,16,'Ö','Ä'),
      c = 'c2: ' + formatter.getBar(data.c2.value,16,'Ö','Ä'),
      d = 'c3: ' + formatter.getBar(data.c3.value,16,'Ö','Ä');
  
  var e = 'c:  ' + formatter.getBar(data.gpuCore.value,16,'Ö','Ä');
      f = 'm:  ' + formatter.getBar(data.gpuMem.value,16,'Ö','Ä'),
      g = 'v:  ' + formatter.getBar(data.gpuVideo.value,16,'Ö','Ä'),
      h = 's:  ' + formatter.getBar(data.gpuShader.value,16,'Ö','Ä'),
  
  var i = e = 'm:  ' + formatter.getBar(data.memory.value,16,'Ö','Ä');

  var j = str.padR('cpu: ' + formatter.getTemp(data.cpuTemp.value) + 'C', 10).substring(0,10) +
          str.padL('gpu: ' + formatter.getTemp(data.gpuTemp.value) + 'C', 10).substring(0,10);

  var k = str.padR('t1:  ' + formatter.getTemp(data.temp1.value) + 'C', 10).substring(0,10) +
          str.padL('t2:  ' + formatter.getTemp(data.temp2.value) + 'C', 10).substring(0,10);

  var l = str.padR('C:   ' + (100 - formatter.getFloat(data.c.value)) + '%', 10).substring(0,10) +
          str.padL('D:   ' + (100 - formatter.getFloat(data.d.value)) + '%', 10).substring(0,10);

  return q() 
    .then(function(){
      console.log('writing data');
      lcd.display(0);
      lcd.reset();
      lcd.write(a);
      lcd.write(b);
      lcd.write(c);
      lcd.write(d);
    }) 
    .then(function(){
      lcd.display(1);
      lcd.reset();
      lcd.write(e);
      lcd.write(f);
      lcd.write(g);
      lcd.write(h);
    }) 
    .then(function(){
      lcd.display(2);
      lcd.reset();
      lcd.write(i);
      lcd.write(j);
      lcd.write(k);
      lcd.write(l);
    })
    .catch(function(err){
      console.log(err);
    });

});

function start(){
  console.log('running start');
  return lcd.up()
    .then(function(){
      console.log('lcd up');
      ohw.start();
    })
  .catch(function(err){
    console.log(err);
  })
}

function stop(){
  ohw.stop();
  setTimeout(function(){
    lcd.down(function(){
      console.log('lcd down');
      process.exit(0)
    });
  }, 2000);
}

start();

process.once('SIGTERM', stop);
process.once('SIGINT', stop);
