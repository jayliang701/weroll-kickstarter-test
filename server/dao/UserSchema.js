/**
 * Created by Jay on 2016/3/7.
 */
var Model = require('weroll/model/Model');
var Schema = require("weroll/dao/DAOFactory").Schema;
var CODES = require("weroll/ErrorCodes");
var Utils = require('weroll/utils/Utils');

var COLLECTION_NAME = "User";

var YEAR = 365 * 24 * 60 * 60 * 1000;

module.exports = function() {
    var schema = new Schema({
        _id: String,
        username: { type:String, index:true, required:true },
        pwd: { type:String, required:true },
        phone: { type:String, index:true, required:true },
        email: { type:String, index:true },
        nickname: { type:String, index:true, required:true },
        gender: { type:Number, default:1, required:true },
        birthday: { type:Number, optional:true },
        age: { type:Number, optional:true },
        type: { type:Number, default:100 },
        lastLoginTime: { type:Number, default:0 },
        status: { type:Number, default:1 }
    }, { collection:COLLECTION_NAME, strict: false });

    //用户数据创建前的唯一性验证
    schema.pre("save", function(next) {
        var data = this;
        data.set("createTime", Date.now());

        if (!data.get("age") && !data.get("birthday")) {
            data.set("birthday", new Date("1992-07-20 00:00:00").getTime());
        }

        if (!data.get("birthday") && data.get("age")) {
            data.set("birthday", Math.round(Date.now() - data.get("age") * YEAR));
        } else if (data.get("birthday") && !data.get("age")) {
            data.set("age", Math.floor((Date.now() - data.get("birthday")) / YEAR));
        }

        //data._id = Utils.randomString(12);
        var opts = [ ];
        if (data.phone && data.phone.hasValue()) {
            opts.push({ phone:data.phone });
        }
        if (data.email && data.email.hasValue()) {
            opts.push({ email:data.email });
        }
        if (data.username && data.username.hasValue()) {
            opts.push({ username:data.username });
        }
        //1. 创建一个查询语句
        var query = schema.$ModelClass.findOne({ $or:opts });
        //2. 设定查询过滤的字段, 多个字段用空格分开
        query.select("phone email username");
        //3. 执行查询
        query.exec(function (err, obj) {
            if (err) {
                next(Error.create(CODES.DB_ERROR, err.toString()));
            } else {
                if (obj) {
                    //如果不存在, 则说明数据库没有存在相同属性的数据, 允许创建
                    next(Error.create(CODES.DATA_EXISTED, "User exists."));
                } else {
                    next();
                }
            }
        });
        /*
         * 上述的查询代码可写成：
         * xxx.findOne({ 查询条件 }, "field1 field2 field3 ...", function(err, obj) { ... })
         * */
    });

    return { name:COLLECTION_NAME, ref:schema };
}