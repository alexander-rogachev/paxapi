var Identity = require('fake-identity');

exports.get = function() {
  return Identity.generate(1);
};
