/**
 * Created by Jay Liang on 15/01/2017.
 */
var assert = require("assert");
var Model = require("weroll/model/Model");
var Utils = require("weroll/utils/Utils");

describe('Mongoose',function() {

    before(function (done) {
        //do something you need before run test cases.

        Model.closeDB(null, function() {
            var config = cloneObject(global.SETTING.model.db);
            config.option.driver = "mongoose";
            Model.openDB(config, true, function(err, db) {
                done(err);
            });
        });
    });

    //each it code block is a test case
    it('DAOFactory.init', function (done) {
        var folder = require("path").join(global.APP_ROOT, "server/dao");
        var DAOFactory = require("weroll/dao/DAOFactory");
        DAOFactory.init(Model.getDBByName(), { folder:folder }, function(err) {
            assert.equal(err, undefined);

            DAOFactory.releaseDBLocks( function(err) {
                assert.equal(err, undefined);

                var model = DAOFactory.create("User");
                assert(model);

                var DAOModel = User;
                assert(DAOModel);
                assert(DAOModel.findOne);
                assert.equal(DAOModel.modelName, "User");

                done();
            });
        });

    });

    it('remove', async function () {
        var result = await User.remove();
        assert(result);
        assert(result.result);
        assert.equal(result.result.ok, 1);
    });

    it('save', async function () {
        var data = {
            _id:Utils.randomString(12),
            phone:"18600000000",
            email:"156070304@qq.com",
            username:"jayliang701",
            pwd:md5("123456"),
            gender:1,
            nickname:"Jay Liang"
        };
        var doc = new User(data);
        doc = await doc.save();
        assert(doc);
        assert(doc._id);
        assert.equal(doc.get("phone"), data.phone);
    });

    it('findOne with async/await', async function () {
        var filter = {
            phone:"18600000000"
        };
        var doc = await User.findOne(filter).exec();
        assert(doc);
        assert(doc._id);
        assert.equal(doc.get("phone"), filter.phone);
    });

    it('findOne with callback', async function () {
        var filter = {
            phone:"18600000000"
        };
        User.findOne(filter, function(err, doc) {
            assert.equal(err, undefined);
            assert(doc);
            assert(doc._id);
            assert.equal(doc.get("phone"), filter.phone);
        });
    });

    var TABLE = "Customer";

    var db3;

    it('findOne with callback', function (done) {
        var config = cloneObject(global.SETTING.model.db);
        config.name += "_y";
        db3 = config.name;

        Model.openDB(config, false, function(err, db) {
            assert.equal(err, undefined);
            assert(db);
            var newDB = Model.DB[db3];
            assert(newDB);
            assert(newDB.insert);
            done();
        });
    });

    it('remove with another DB', async function() {
        var result = await Model.DB[db3].remove(TABLE, { });
        assert(result);
        assert.equal(result.ok, 1);
    });

    it('insertList with another DB', async function() {
        var list = [ { name:"Jay1", gender:1 }, { name:"Jay2", gender:1 } ];
        var result = await Model.DB[db3].insertList(TABLE, list);
        assert(result);
        assert.equal(result.result.ok, 1);
        assert.equal(result.result.n, list.length);
        assert.equal(result.insertedCount, list.length);
    });

    it('count with another DB', async function() {
        var result = await Model.DB[db3].count(TABLE, { name:"Jay2" });
        assert(result);
        assert.equal(result, 1);
    });

    it('close another DB', function(done) {
        Model.closeDB(db3, function(err) {
            assert.equal(err, undefined);
            assert.equal(Model.DB[db3], undefined);
            done();
        });
    });

});