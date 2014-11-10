var fs = require('fs');
var reg = new RegExp("{:.*?}")

/**
 * Function loads sqlFile from path with paramsObject
 * @param path
 * @param paramsObject
 * @returns sqlText for execution
 * Ex: sqlfileLoad('my.sql', ["'123'", 555])
 * Ex. sqlfileLoad('my.sql', [{param1: "'123'", id:555})
 * sql file example insert into test1 (a, id) values({:param1}, {:id})
 * OR Params may not exists in sql file then function returns sqlFile as is
 */
exports.sqlfileLoad = function (path, paramsObject) {

    function replaceParams(sqlText) {
        var result = sqlText;
        if (Array.isArray(paramsObject)) {
            for (var index in paramsObject) {
                result = result.replace(reg, paramsObject[index]);
            }
            return result;

        } else {
            for (var key in paramsObject) {
                result = result.replace('{:' + key + '}', paramsObject[key]);
            }
            return result;
        }
    }

    var raw = fs.readFileSync(path, {encoding: 'UTF8'});
    return replaceParams(raw);
}