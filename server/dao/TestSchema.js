/**
 * Created by Jay on 2016/3/7.
 */
var Schema = require("weroll/dao/DAOFactory").Schema;

var COLLECTION_NAME = "Test";

module.exports = function() {
    var schema = new Schema({
        name: { type:String, index:true, required:true },
        head: "String"
    }, { collection:COLLECTION_NAME, strict: false });

    schema.pre("save", function(next) {
        //do something before save
        next();
    });

    schema.static("queryByName", function(name, fields, callBack) {
        return this.find({ name:name }).select(fields).exec(function(err, doc) {
            callBack && callBack(err, doc);
        });
    });

    return { name:COLLECTION_NAME, ref:schema };
}