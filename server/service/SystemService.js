/**
 * Created by Jay on 4/1/15.
 */

exports.config = {
    name: "system",
    enabled: true,
    security: {
        //@now 获得服务器当前时间 @format 时间格式,1 - 时间戳,2 - 字符串
        "now":{ needLogin:false, checkParams:{ format:"int" } },
        //@now2 获得服务器当前时间 @format 时间格式,1 - 时间戳,2 - 字符串
        "now2":{ needLogin:false, checkParams:{ format:"int" } }
    }
};

var CODES = require("weroll/ErrorCodes");
var Setting = global.SETTING;

exports.now = function(req, res, params) {
    var format = params.format;
    if (format == 1 || format == 2) {
        var now = new Date();
        if (format == 1) {
            now = now.getTime();
        } else {
            now = now.toString();
        }
        res.sayOK({ time:now });
    } else {
        res.sayError(CODES.REQUEST_PARAMS_INVALID, "invalid time format");
    }
}

exports.now2 = async function(req, res, params) {
    var result;
    try {
        result = await req.callAPI("system.now", { format:2 });
        result.name = "now2";
    } catch (err) {
        return res.sayError(err);
    }

    res.sayOK(result);
}


