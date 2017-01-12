/**
 * Created by YDY on 2016/3/2.
 */


var assert = require("assert");
var Model = require("weroll/model/Model");

describe('MongoDB',function() {

    var TABLE = "Customer";
    var totalNum = 0;

    before(async function () {
        //do something you need before run test cases.
        await Model.DB.remove(TABLE, {});
    });

    //each it code block is a test case
    it('insert', async function() {
        var result = await Model.DB.insert(TABLE, { name:"Jay", gender:1 });
        assert(result);
        assert.equal(result.result.ok, 1);
        assert.equal(result.result.n, 1);
    });

    it('insertList', async function() {
        var list = [ { name:"Jay1", gender:1 }, { name:"Jay2", gender:1 } ];
        var result = await Model.DB.insertList(TABLE, list);
        assert(result);
        assert.equal(result.result.ok, 1);
        assert.equal(result.result.n, list.length);
        assert.equal(result.insertedCount, list.length);
    });

    it('count', async function() {
        var result = await Model.DB.count(TABLE, { gender:1 });
        assert(result);
        assert.equal(result, 3);
        totalNum = 3;
    });

    it('find', async function() {
        var result = await Model.DB.find(TABLE, { gender:1 });
        assert(result);
        assert.equal(result.length, totalNum);
        result.forEach(function (doc) {
            assert(doc);
            assert.equal(doc.gender, 1);
        });
    });

    it('find width fields', async function() {
        var result = await Model.DB.find(TABLE, { gender:1 }, { _id:1 });
        assert(result);
        result.forEach(function (doc) {
            assert(doc);
            var keys = Object.keys(doc);
            assert.equal(keys.length, 1);
            assert.equal(keys[0], "_id");
        });
    });

    it('find width sort', async function() {
        var result = await Model.DB.find(TABLE, { }, { name:1 }, { name:1 });
        assert(result);
        assert.equal(result[0].name, "Jay");
        assert.equal(result[result.length - 1].name, "Jay2");

        result = await Model.DB.find(TABLE, { }, { name:1 }, { name:-1 });
        assert(result);
        assert.equal(result[0].name, "Jay2");
        assert.equal(result[result.length - 1].name, "Jay");
    });

    it('find width pagination', async function() {
        var result = await Model.DB.find(TABLE, { }, null, { name:1 }, { index:0, num:1 });
        assert(result);
        assert.equal(result.length, 1);
        assert.equal(result[0].name, "Jay");

        result = await Model.DB.find(TABLE, { }, null, { name:1 }, { index:1, num:1 });
        assert(result);
        assert.equal(result.length, 1);
        assert.equal(result[0].name, "Jay1");
    });

    it('findOne', async function() {
        var result = await Model.DB.findOne(TABLE, { gender:1 });
        assert(result);
        assert.equal(result.gender, 1);
    });

    it('findOne with fields', async function() {
        var result = await Model.DB.findOne(TABLE, { gender:1 }, { _id:1 });
        assert(result);
        var keys = Object.keys(result);
        assert.equal(keys.length, 1);
        assert.equal(keys[0], "_id");
    });

    it('findPage', async function() {
        var result = await Model.DB.findPage(TABLE, { }, null, { name:1 }, { index:0, num:2 });
        assert(result);
        assert.equal(result.list.length, 2);
        assert.equal(result.totalNum, totalNum);
        assert.equal(result.pageIndex, 0);
        assert.equal(result.pageSize, 2);

        result = await Model.DB.findPage(TABLE, { }, null, { name:1 }, { index:0, num:totalNum * 2 });
        assert(result);
        assert.equal(result.list.length, totalNum);
        assert.equal(result.totalNum, totalNum);
        assert.equal(result.pageIndex, 0);
        assert.equal(result.pageSize, totalNum * 2);
    });

    it('aggregate', async function() {
        var result = await Model.DB.aggregate(TABLE, [
            { $match : { gender:1 } },
            { $group : { _id :null, totalNum : { $sum : 1 }}}
        ]);
        assert(result);
        assert.equal(result[0].totalNum, totalNum);
    });

    it('update', async function() {
        var result = await Model.DB.update(TABLE, { name:"Jay2" }, { phone:"911" });
        assert(result);
        assert.equal(result.ok, 1);
        assert.equal(result.nModified, 1);
        assert.equal(result.n, 1);
        assert.equal(result.upserted, undefined);

        result = await Model.DB.update(TABLE, { name:"Jay3" }, { phone:"911" });
        assert(result);
        assert.equal(result.ok, 1);
        assert.equal(result.nModified, 0);
        assert.equal(result.n, 0);
        assert.equal(result.upserted, undefined);

        result = await Model.DB.update(TABLE, {}, { status:1 }, { multi:true });
        assert(result);
        assert.equal(result.ok, 1);
        assert.equal(result.nModified, totalNum);
        assert.equal(result.n, totalNum);
        assert.equal(result.upserted, undefined);

        result = await Model.DB.update(TABLE, { name:"Jay3" }, { phone:"911" }, { upsert:true });
        assert(result);
        assert.equal(result.ok, 1);
        assert.equal(result.nModified, 0);
        assert.equal(result.n, 1);
        assert.equal(result.upserted.length, 1);
    });

    it('findOneAndUpdate', async function() {
        var result = await Model.DB.findOneAndUpdate(TABLE, { name:"Jay" }, { phone:"110" }, { fields:{ name:1 } });
        assert(result);
        assert.equal(result.name, "Jay");

        result = await Model.DB.findOneAndUpdate(TABLE, { name:"Jay" }, { phone:"120" }, { new:true });
        assert(result);
        assert.equal(result.name, "Jay");
        assert.equal(result.phone, "120");
    });

    it('findOneAndDelete', async function() {
        var result = await Model.DB.findOneAndDelete(TABLE, { name:"Jay3" }, { fields:{ name:1 } });
        assert(result);
        assert.equal(result.name, "Jay3");
    });

    it('remove', async function() {
        var result = await Model.DB.remove(TABLE, { name:"Jay2" });
        assert(result);

        result = await Model.DB.remove(TABLE, { }, { single:true });
        assert(result);
        assert.equal(result.n, 1);
    });

    it('closeDB', function(done) {
        Model.closeDB(null, function(err) {
            assert.equal(err, undefined);
            assert.equal(Model.DB.insert, undefined);
            done();
        });
    });

    it('openDB', function(done) {
        Model.openDB(global.SETTING.model.db, true, function(err, db) {
            assert.equal(err, undefined);
            assert(db);
            assert(Model.DB.insert);
            done();
        });
    });

    var db2;

    it('open one more DB', function(done) {
        var config = cloneObject(global.SETTING.model.db);
        config.name += "_x";
        db2 = config.name;
        Model.openDB(config, false, function(err, db) {
            assert.equal(err, undefined);
            assert(db);
            var newDB = Model.DB[db2];
            assert(newDB);
            assert(newDB.insert);
            done();
        });
    });

    it('remove with another DB', async function() {
        var result = await Model.DB[db2].remove(TABLE, { });
        assert(result);
        assert.equal(result.ok, 1);
    });

    it('insertList with another DB', async function() {
        var list = [ { name:"Jay1", gender:1 }, { name:"Jay2", gender:1 } ];
        var result = await Model.DB[db2].insertList(TABLE, list);
        assert(result);
        assert.equal(result.result.ok, 1);
        assert.equal(result.result.n, list.length);
        assert.equal(result.insertedCount, list.length);
    });

    it('count with another DB', async function() {
        var result = await Model.DB[db2].count(TABLE, { name:"Jay2" });
        assert(result);
        assert.equal(result, 1);
    });

    it('close another DB', function(done) {
        Model.closeDB(db2, function(err) {
            assert.equal(err, undefined);
            assert.equal(Model.DB[db2], undefined);
            done();
        });
    });

});
