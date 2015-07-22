var i2c = require('i2c-bus'),
    q = require('q'),
    _ = require('lodash');
    buffer = require('buffer'),
    str = require('../helpers/string'),
    helpers = require('../helpers/general');

var address = 0x3c,
    cmd = 0x80,
    data = 0x40;

var i2c1 = i2c.openSync(1);
exports.up = up;
exports.down = down;
exports.sleep = sleep;
exports.wake = wake;
exports.reset = reset;
exports.write = write;

function up(){
  console.log('trying to do a setup');
  return helpers.delay(100)
    .then(function(){
      i2c1.writeByteSync(address, cmd, 0x2A) // Set "RE"=1  00101010B
      i2c1.writeByteSync(address, cmd, 0x08) 
      i2c1.writeByteSync(address, cmd, 0x71) // Function Selection A
      i2c1.writeByteSync(address, cmd, 0x00) // 0x00 - Disable        0x5C - Enable       Internal Vdd regulator at 5V I/O application mode             

      i2c1.writeByteSync(address, cmd, 0x2A) // Set "RE"=1  00101010B
      i2c1.writeByteSync(address, cmd, 0x79) // Set "SD"=1  01111001B
      i2c1.writeByteSync(address, cmd, 0xD5)
      i2c1.writeByteSync(address, cmd, 0x70)
      i2c1.writeByteSync(address, cmd, 0x78) // Set "SD"=0
      i2c1.writeByteSync(address, cmd, 0x09) // Set 5-dot 4 line
      i2c1.writeByteSync(address, cmd, 0x06) // Set Com31-->Com0  Seg0-->Seg99

      i2c1.writeByteSync(address, cmd, 0x72) // Function Selection B
    })  
    .then(function(){return helpers.delay(10)})
    .then(function(){
      i2c1.writeByteSync(address, data, 0x00)

      i2c1.writeByteSync(address, cmd, 0x79) // Set "SD"=1  01111001B

      i2c1.writeByteSync(address, cmd, 0xDA)
      i2c1.writeByteSync(address, cmd, 0x10)

      i2c1.writeByteSync(address, cmd, 0xDC); // Function Selection C
      i2c1.writeByteSync(address, cmd, 0x03);
    })
    .then(function(){return helpers.delay(100)})
    .then(function(){

      i2c1.writeByteSync(address, cmd, 0x81) // Set Contrast
      i2c1.writeByteSync(address, cmd, 0x33)
      
      
      i2c1.writeByteSync(address, cmd, 0xD9) // Set Pre-Charge Period
      i2c1.writeByteSync(address, cmd, 0xF1)

      i2c1.writeByteSync(address, cmd, 0xDB) // Set VCOM deselect level
      i2c1.writeByteSync(address, cmd, 0x30)

      i2c1.writeByteSync(address, cmd, 0x78) // Exiting Set OLED Characterization
      i2c1.writeByteSync(address, cmd, 0x28)

      i2c1.writeByteSync(address, cmd, 0x08) // set display off
      i2c1.writeByteSync(address, cmd, 0x01) // clear display
      i2c1.writeByteSync(address, cmd, 0x80) // Set DDRAM Address to 0x80 (line 1 start)
      i2c1.writeByteSync(address, cmd, 0x0C) // Set Sleep Mode Off
    });
}

function down()
{
  // Normal Operation
  
  // Power down Vcc (GPIO)
  i2c1.writeByteSync(address, cmd, 0x2A);
  i2c1.writeByteSync(address, cmd, 0x79);
  i2c1.writeByteSync(address, cmd, 0xDC);
  i2c1.writeByteSync(address, cmd, 0x02);
  
  // Set Display Off
  i2c1.writeByteSync(address, cmd, 0x78);
  i2c1.writeByteSync(address, cmd, 0x28);
  i2c1.writeByteSync(address, cmd, 0x08);
  
  // (100ms Delay Recommended
  return helpers.delay(100);
  
  // Power down Vdd
  // Vdd/Vcc off State
}

function sleep(){
  // Normal operation

  // Power down Vcc (GPIO)
  i2c1.writeByteSync(address, cmd, 0x2A);
  i2c1.writeByteSync(address, cmd, 0x79);
  i2c1.writeByteSync(address, cmd, 0xDC);
  i2c1.writeByteSync(address, cmd, 0x02);
  
  // Set Display Off
  i2c1.writeByteSync(address, cmd, 0x78);
  i2c1.writeByteSync(address, cmd, 0x28);
  i2c1.writeByteSync(address, cmd, 0x08);

  // Disable Internal Regulator
  i2c1.writeByteSync(address, cmd, 0x2A);
  i2c1.writeByteSync(address, cmd, 0x71);
  i2c1.writeByteSync(address, data, 0x00);
  i2c1.writeByteSync(address, cmd, 0x28);

  // Sleep Mode
  return q();  
}

function wake(){
  // Sleep Mode

  // Disable Internal Regulator
  i2c1.writeByteSync(address, cmd, 0x2A);
  i2c1.writeByteSync(address, cmd, 0x79);
  i2c1.writeByteSync(address, cmd, 0x71);
  i2c1.writeByteSync(address, cmd, 0x5C);
  i2c1.writeByteSync(address, cmd, 0xDC);
  i2c1.writeByteSync(address, cmd, 0x03);

  // Power up Vcc (100ms Delay Recommended)
  return helpers.delay(100)
    .then(function(){
      i2c1.writeByteSync(address, cmd, 0x78);
      i2c1.writeByteSync(address, cmd, 0x28);
      i2c1.writeByteSync(address, cmd, 0x0C);
    });
  
  // Normal Operation
}

function data(d){
  return function(){
    i2c1.writeByteSync(address, data, d);
    return helpers.delay(5);
  }
}

function command(d){
  return function(){
    i2c1.writeByteSync(address, cmd, d);
    return helpers.delay(5);
  }
}
function reset(){
  i2c1.writeByteSync(address, cmd, 0x80) // clear display
}

function write(line){
  console.log(line);
  str.padR(line, 20, ' ').split('').forEach(function(c){
    return i2c1.writeByteSync(address, data, c.charCodeAt(0));
  });
}


