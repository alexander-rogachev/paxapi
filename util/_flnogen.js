// Ridiculously simple booking number generator
exports.flnogen = function(length, prefix) {
  var flno = prefix || '';
  var possible = "0123456789";

  for( var i=0; i < length; i++ )
    flno += possible.charAt(Math.floor(Math.random() * possible.length));

  return flno;
}
