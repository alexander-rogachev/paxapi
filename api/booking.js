var Q = require('q');
var wait = require('wait.for');

module.exports = function (params) {
    var module = {};

    module.verbose = params.verbose;

    module.client = params.client;

    module.apikey = params.apikey;

    module.baseUrl = params.baseUrl;


    module.client.qGet = function (url, args, stdCallback) {
        this.get(url, args, function (data, response) {
            return stdCallback(null, {data: data, response: response});
        });
    };

    module.client.qPost = function (url, args, stdCallback) {
        this.post(url, args, function (data, response) {
            return stdCallback(null, {data: data, response: response});
        });
    };



    /*
     GET /bookings/{bookingId}/detail
     todo: DK
     */
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
    }


    module.postSync = function (bxml) {
            var args = {
                data: bxml,
                headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
            };
            var url = module.baseUrl + '/bookings';
            if (module.verbose) {
                console.log('POST ' + url + ' with XML ...');
            }

            var result =  wait.forMethod(module.client, "qPost", url, args);
                if (result.response.statusCode === 401) {
                    throw new Error("401 - API key required");
                } else if (result.response.statusCode !== 201) {
                    throw new Error(result.response.statusCode + " - Something went wrong... :-(");
                }
                var boid = result.response.headers.location.substring(result.response.headers.location.lastIndexOf('/') + 1);
                boid = boid.replace('#', '')
                return boid;
    };
    /*
     POST /bookings/
     todo DK
     */
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

    /*
     DELETE /bookings/{bookingId}
     */
    module.delete = function (bid) {
//    todo:
    };

    /*
     PUT /bookings/{bookingId}
     */
    module.put = function (bid, bxml) {
//    todo:
    };

    return module;
};
