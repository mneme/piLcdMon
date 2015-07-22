var ohw = require('./lib/openHardwareMonitor/openHardwareMonitor'),
    str = require('./lib/helpers/string'),
    formatter = require('./lib/formatters/general'),
    lcd = require('./lib/lcd/manager');

ohw.on('data', function(d){

  var a = 'CPU: ' + formatter.getBar(d.cpuLoad.value,15,'Ö','Ä');
  var b = 'GPU: ' + formatter.getBar(d.gpuLoad.value,15,'Ö','Ä');

  var c = str.padR('CPU: ' + formatter.getTemp(d.cpuTemp.value) + 'C', 10).substring(0,10) +
          str.padL('GPU: ' + formatter.getTemp(d.gpuTemp.value) + 'C', 10).substring(0,10);
  

  var d = str.padR('C:   ' + (100 - formatter.getPercent(d.c.value)) + '%', 10).substring(0,10) +
          str.padL('D:   ' + (100 - formatter.getPercent(d.d.value)) + '%', 10).substring(0,10);

  return lcd.display(0)
    .then(function(){
      console.log('writing data');
      lcd.reset();
      lcd.write(a);
      lcd.write(b);
      lcd.write(c);
      lcd.write(d);
      return lcd.display(1);
    }) 
    .then(function(){
      lcd.reset();
      lcd.write(a);
      lcd.write(b);
      lcd.write(c);
      lcd.write(d);
      return lcd.display(2);
    }) 
    .then(function(){
      lcd.reset();
      lcd.write(a);
      lcd.write(b);
      lcd.write(c);
      lcd.write(d);
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
