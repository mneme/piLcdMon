var ohw = require('./lib/openHardwareMonitor/openHardwareMonitor'),
    str = require('./lib/helpers/string'),
    formatter = require('./lib/formatters/general'),
    lcd = require('./lib/lcd/manager'),
    q = require('q'),
    str = require('./lib/helpers/string');

ohw.on('data', function(d){

  var a = 'c0: ' + formatter.getBar(d.c0.value,16,'Ö','Ä'),
      b = 'c1: ' + formatter.getBar(d.c1.value,16,'Ö','Ä'),
      c = 'c2: ' + formatter.getBar(d.c2.value,16,'Ö','Ä'),
      d = 'c3: ' + formatter.getBar(d.c3.value,16,'Ö','Ä');
  console.log(1);
  var e = 'c:  ' + formatter.getBar(d.gpuCore.value,16,'Ö','Ä');
    console.log(1);

  var f = 'm:  ' + formatter.getBar(d.gpuMem.value,16,'Ö','Ä');
    console.log(1);

  var g = 'v:  ' + formatter.getBar(d.gpuVideo.value,16,'Ö','Ä');
    console.log(1);

  var h = 's:  ' + formatter.getBar(d.gpuShader.value,16,'Ö','Ä');
  console.log(2);

  var i = str.padR('CPU: ' + formatter.getTemp(d.cpuTemp.value) + 'C', 10).substring(0,10) +
          str.padL('GPU: ' + formatter.getTemp(d.gpuTemp.value) + 'C', 10).substring(0,10);
    console.log(3);

  var j = str.padR('t1:  ' + formatter.getTemp(d.temp1.value) + 'C', 10).substring(0,10) +
          str.padL('t2:  ' + formatter.getTemp(d.temp2.value) + 'C', 10).substring(0,10);

  console.log(4);
  var k = str.padR('C:   ' + (100 - formatter.getPercent(d.c.value)) + '%', 10).substring(0,10) +
          str.padL('D:   ' + (100 - formatter.getPercent(d.d.value)) + '%', 10).substring(0,10);
  console.log(5);

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
      lcd.write(str.padR(20));
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
