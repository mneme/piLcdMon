exports.padL = padL;
exports.padR = padR;


function padL(str, len, c){
  if(str.length > len){
    return str;
  }
  c = c || ' ';
  return Array(len + 1 - str.length).join(c) + str;
}

function padR(str, len, c){
  if(str.length > len){
    return str;
  }
  c = c || ' ';
  return str + Array(len + 1 - str.length).join(c);
}