var Q = require('q');
var pg = require('pg');
var wait = require('wait.for');


pg.Client.prototype.connectSync = function () {
    wait.forMethod(this, 'connect');
    console.log("connected to base")
}

pg.Client.prototype.querySync = function () {
    wait.forMethod(this, 'connect');
    console.log("query")
}

pg.Client.prototype.endSync = function () {
    console.log("Start disconnected")
    wait.forMethod(this, 'end');
}

pg.Client.prototype.querySync = function (query) {
    return wait.forMethod(this, 'query', query);
}


module.exports = pg


/* module.client.qGet = function (url, args, stdCallback) {
 this.get(url, args, function (data, response) {
 return stdCallback(null, {data: data, response: response});
 });
 };

 module.client.qPost = function (url, args, stdCallback) {
 this.post(url, args, function (data, response) {
 return stdCallback(null, {data: data, response: response});
 });
 };

 module.client.qDelete = function (url, args, stdCallback) {
 this.delete(url, args, function (data, response) {
 return stdCallback(null, {data: data, response: response});
 });
 };

 module.client.qPut = function (url, args, stdCallback) {
 this.put(url, args, function (data, response) {
 return stdCallback(null, {data: data, response: response});
 });
 };

 */
/*
 GET /bookings/{bookingId}/detail
 todo: DK
 */
/*
 module.get = function (bid) {
 return Q.Promise(function (resolve, reject, notify) {

 var args = {
 headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
 };
 var url = module.baseUrl + '/bookings/' + bid + '/detail';
 if (module.verbose) {
 console.log('GET ' + url + ' ...');
 }
 module.client.get(url, args, function (data, response) {

 if (response.statusCode === 401) {
 reject("401 - API key required");
 return;
 } else if (response.statusCode !== 200) {
 reject(response.statusCode + " - Something went wrong... :-(");
 return;
 }
 resolve(data);

 });

 });
 };

 module.getSync = function (bid) {
 var args = {
 headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
 };
 var url = module.baseUrl + '/bookings/' + bid + '/detail';

 var result = wait.forMethod(module.client, "qGet", url, args);

 if (result.response.statusCode === 401) {
 throw new Error("401 - API key required");
 } else if (result.response.statusCode !== 200) {
 throw new Error(result.response.statusCode + " - Something went wrong... :-(");
 }
 return result.data;
 };


 module.postSync = function (bxml) {
 var args = {
 data: bxml,
 headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
 };
 var url = module.baseUrl + '/bookings';
 if (module.verbose) {
 console.log('POST ' + url + ' with XML ...');
 }

 var result = wait.forMethod(module.client, "qPost", url, args);
 if (result.response.statusCode === 401) {
 throw new Error("401 - API key required");
 } else if (result.response.statusCode !== 201) {
 throw new Error(result.response.statusCode + " - Something went wrong... :-(");
 }
 var boid = result.response.headers.location.substring(result.response.headers.location.lastIndexOf('/') + 1);
 boid = boid.replace('#', '')
 return boid;
 };
 */
/*
 POST /bookings/
 todo DK
 */
/*
 module.post = function (bxml) {
 return Q.Promise(function (resolve, reject, notify) {

 var args = {
 data: bxml,
 headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
 };
 var url = module.baseUrl + '/bookings';
 if (module.verbose) {
 console.log('POST ' + url + ' with XML ...');
 }
 module.client.post(url, args, function (data, response) {

 if (response.statusCode === 401) {
 reject("401 - API key required");
 return;
 } else if (response.statusCode !== 201) {
 reject(response.statusCode + " - Something went wrong... :-(");
 return;
 }
 var boid = response.headers.location.substring(response.headers.location.lastIndexOf('/') + 1);
 resolve(boid.replace('#', ''));

 });

 });
 };

 */
/*
 DELETE /bookings/{bookingId}
 */
/*
 module.delete = function (bid) {
 return Q.Promise(function (resolve, reject, notify) {

 var args = {
 headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
 };
 var url = module.baseUrl + '/bookings/' + bid + '/';
 if (module.verbose) {
 console.log('DELETE ' + url + ' ...');
 }
 module.client.delete(url, args, function (data, response) {
 if (response.statusCode === 401) {
 reject("401 - API key required");
 return;
 } else if (response.statusCode === 404) {
 reject("404 - Booking not found");
 return;
 } else if (response.statusCode !== 200) {
 reject(response.statusCode + " - Something went wrong... :-(");
 return;
 }
 resolve(data);
 });
 });
 };

 */
/*
 PUT /bookings/{bookingId}
 */
/*
 module.put = function (bid, bxml) {
 return Q.Promise(function (resolve, reject, notify) {

 var args = {
 data: bxml,
 headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
 };
 var url = module.baseUrl + '/bookings/' + bid + '/';
 if (module.verbose) {
 console.log('PUT ' + url + ' with XML ...');
 }
 module.client.put(url, args, function (data, response) {

 if (response.statusCode === 401) {
 reject("401 - API key required");
 return;
 } else if (response.statusCode !== 200) {
 reject(response.statusCode + " - Something went wrong... :-(");
 return;
 }
 resolve(data);

 });

 });
 };


 module.deleteSync = function (bid) {
 var args = {
 headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey}
 };
 var url = module.baseUrl + '/bookings/' + bid + '/';
 if (module.verbose) {
 console.log('DELETE ' + url + ' ...');
 }
 var result = wait.forMethod(module.client, "qDelete", url, args);

 if (result.response.statusCode === 401) {
 throw new Error("401 - API key required");
 } else if (result.response.statusCode === 404) {
 throw new Error("404 - Booking not found");
 } else if (result.response.statusCode !== 200) {
 throw new Error(" - Something went wrong... :-(");
 }
 return result;
 };

 module.putSync = function (bid, bxml) {
 var args = {
 data: bxml,
 headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
 };
 var url = module.baseUrl + '/bookings/' + bid + '/';
 if (module.verbose) {
 console.log('PUT ' + url + ' with XML ...');
 }
 var result = wait.forMethod(module.client, "qPut", url, args);

 if (result.response.statusCode === 401) {
 throw new Error("401 - API key required");
 } else if (result.response.statusCode !== 200) {
 throw new Error(result.response.statusCode + " - Something went wrong... :-(");
 }
 return result;
 };
 */

