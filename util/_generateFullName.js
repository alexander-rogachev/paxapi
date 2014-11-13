var eden = require('node-eden');

exports.getName = function() {
  var name = eden.adam();
  return name;
};

exports.getSurname = function() {
  var surname = eden.word()
  return surname.charAt(0).toUpperCase() + surname.slice(1);
};
