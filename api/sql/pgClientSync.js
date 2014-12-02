var Q = require('q');
var pg = require('pg');
var wait = require('wait.for');


pg.Client.prototype.connectSync = function () {
    wait.forMethod(this, 'connect');
}


pg.Client.prototype.endSync = function () {
    wait.forMethod(this, 'end');
}

pg.Client.prototype.querySync = function (query) {
    return wait.forMethod(this, 'query', query);
}


module.exports = pg

