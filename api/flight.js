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

    /*
     POST /flights
     Creates a new flight
     */
    module.post = function (fxml) {
        return Q.Promise(function (resolve, reject, notify) {

            var args = {
                data: fxml,
                headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
            };
            var url = module.baseUrl + '/flights/';
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
                var flid = response.headers.location.substring(response.headers.location.lastIndexOf('/') + 1);
                resolve(flid.replace('#', ''));

            });

        });
    };

    module.postSync = function (bxml) {
        var args = {
            data: bxml,
            headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
        };
        var url = module.baseUrl + '/flights/';
        if (module.verbose) {
            console.log('POST ' + url + ' with XML ...');
        }

        var result = wait.forMethod(module.client, "qPost", url, args);
        if (result.response.statusCode === 401) {
            throw new Error("401 - API key required");
        } else if (result.response.statusCode !== 201) {
            throw new Error(result.response.statusCode + " - Something went wrong... :-(");
        }
        var flid = result.response.headers.location.substring(result.response.headers.location.lastIndexOf('/') + 1);
        flid = flid.replace('#', '')
        return flid;
    };

    /*
     GET /flights/{flightId}
     */
    module.get = function (fid) {
        return Q.Promise(function (resolve, reject, notify) {

            var args = {
                headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
            };
            var url = module.baseUrl + '/flights/' + fid + '/';
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

    module.getSync = function (fid) {
        var args = {
            headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
        };
        var url = module.baseUrl + '/flights/' + fid + '/';
        if (module.verbose) {
            console.log('GET ' + url + ' ...');
        }
        var result = wait.forMethod(module.client, "qGet", url, args);

        if (result.response.statusCode === 401) {
            throw new Error("401 - API key required");
        } else if (result.response.statusCode !== 200) {
            throw new Error(result.response.statusCode + " - Something went wrong... :-(");
        }
        return result.data;
    };

    /*
     PUT /flights/{flightId}
     */
    module.put = function (fid, fxml) {
        return Q.Promise(function (resolve, reject, notify) {

            var args = {
                data: fxml,
                headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
            };
            var url = module.baseUrl + '/flights/' + fid + '/';
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

    module.putSync = function (fid, fxml) {
        var args = {
            data: fxml,
            headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
        };
        var url = module.baseUrl + '/flights/' + fid + '/';
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


    /*
     DELETE /flights/{flightId}
     */
    module.delete = function (fid) {
        return Q.Promise(function (resolve, reject, notify) {

            var args = {
                headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
            };
            var url = module.baseUrl + '/flights/' + fid + '/';
            if (module.verbose) {
                console.log('DELETE ' + url + ' ...');
            }
            module.client.delete(url, args, function (data, response) {

                if (response.statusCode === 401) {
                    reject("401 - API key required");
                    return;
                } else if (response.statusCode === 404) {
                    reject("404 - Flight not found");
                    return;
                } else if (response.statusCode !== 204) {
                    reject(response.statusCode + " - Something went wrong... :-(");
                    return;
                }
                resolve(data);
            });

        });
    };

    module.deleteSync = function (fid) {
        var args = {
            headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey}
        };
        var url = module.baseUrl + '/flights/' + fid + '/';
        if (module.verbose) {
            console.log('DELETE ' + url + ' ...');
        }
        var result = wait.forMethod(module.client, "qDelete", url, args);

        if (result.response.statusCode === 401) {
            throw new Error("401 - API key required");
        } else if (result.response.statusCode === 404) {
            throw new Error("404 - Flight not found");
        } else if (result.response.statusCode !== 204) {
            throw new Error(response.statusCode + " - Something went wrong... :-(");
        }
        return result;
    };

    return module;
};
