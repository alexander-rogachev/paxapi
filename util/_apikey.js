// API Key reader reads it from file.

var fs = require('fs');
var path = require('path');

exports.getSync = function() {
  return fs.readFileSync(path.resolve(__dirname, '../.api_key'), 'utf8');
};
