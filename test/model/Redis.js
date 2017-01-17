/**
 * Created by YDY on 2016/3/2.
 */


var assert = require("assert");
var Model = require("weroll/model/Model");
var Redis = require("weroll/model/Redis");

describe('Redis',function() {

    before(function (done) {
        //do something you need before run test cases.
        Redis.findKeysAndDel("*", function() {
            done();
        });
    });

    //each it code block is a test case
    it('set', async function() {
        var result = await Redis.set("name", "Jay");
        assert(result);
        assert.equal(result, "OK");
    });

    it('get', async function() {
        var result = await Redis.get("name");
        assert(result);
        assert.equal(result, "Jay");
    });

    it('del', async function() {
        var result = await Redis.del("name");
        assert(result);
        assert.equal(result, 1);
    });

    it('set with expire', async function() {
        var result = await Redis.set("name", "Jay", 1);
        assert(result);
        assert.equal(result, "OK");

        await sleep(1200);

        result = await Redis.get("name");
        assert.equal(result, undefined);
    });

    it('save', async function() {
        var result = await Redis.save("name", "JayX");
        assert(result);
        assert.equal(result, "JayX");
    });

    it('read', async function() {
        var result = await Redis.read("name");
        assert(result);
        assert.equal(result, "JayX");
    });

    it('save object', async function() {
        var val = { first:"Jay", last:"Liang" };
        var result = await Redis.save("name", val);
        assert(result);
        assert.equal(result, val);
    });

    it('read object', async function() {
        var result = await Redis.read("name");
        assert(result);
        assert.equal(result.first, "Jay");
        assert.equal(result.last, "Liang");
    });

    it('remove', async function() {
        await Redis.remove("name");
        var result = await Redis.read("name");
        assert.equal(result, undefined);
    });

    it('do', async function() {
        var result = await Redis.do("set", [ Redis.join("name"), "Jay" ]);
        assert(result);
        assert.equal(result, "OK");
    });

    it('multi', async function() {
        var tasks = [
            [ "set", Redis.join("name"), "JayX", function(err, res) {
                assert.equal(res, "OK");
            } ],
            [ "get", Redis.join("name"), function(err, res) {
                assert.equal(res, "JayX");
            } ]
        ];
        await Redis.multi(tasks);
        assert.ok(true);
    });

    it('join', function() {
        var result = Redis.join("name");
        assert.equal(result, global.SETTING.model.redis.prefix["*"] + "name");
        result = Redis.join("@common->name");
        assert.equal(result, global.SETTING.model.redis.prefix["common"] + "name");
    });

    it('key prefix', async function() {
        var tasks = [
            [ "set", Redis.join("name"), "JayX", function(err, res) {
                assert.equal(res, "OK");
            } ],
            [ "get", Redis.join("name"), function(err, res) {
                assert.equal(res, "JayX");
            } ],

            [ "set", Redis.join("@common->name"), "JayX", function(err, res) {
                assert.equal(res, "OK");
            } ],
            [ "get", Redis.join("@common->name"), function(err, res) {
                assert.equal(res, "JayX");
            } ],

            [ "set", Redis.join("@site->name"), "JayX", function(err, res) {
                assert.equal(res, "OK");
            } ],
            [ "get", Redis.join("@site->name"), function(err, res) {
                assert.equal(res, "JayX");
            } ]
        ];
        await Redis.multi(tasks);
        assert.ok(true);
    });

    it('pub/sub', function(done) {
        Redis.createClient(null, function(sub) {
            assert(sub);

            sub.on("message", function(channel, message) {
                assert(channel);
                assert(message);
                assert.equal(channel, "talk");
                assert.equal(message, "hi");
                done();
            });
            sub.subscribe("talk", function(err) {
                assert.equal(err, undefined);
                Redis.publish("talk", "hi");
            });
        });
    });

    it('checkLock', async function() {
        await Redis.checkLock("balance");
        assert.ok(true);

        try {
            await Redis.checkLock("balance", null, 10, 0.1);
        } catch (exp) {
            assert(exp);
        }
    });

    it('releaseLock', async function() {
        await Redis.releaseLock("balance");
        assert.ok(true);

        await Redis.checkLock("balance");
        assert.ok(true);

        await Redis.releaseLock("balance");
        assert.ok(true);
    });

    it('releaseAllLock', async function() {
        await Redis.checkLock("balance");
        assert.ok(true);

        await Redis.releaseAllLocks();
        assert.ok(true);

        await Redis.checkLock("balance");
        assert.ok(true);

        await Redis.releaseAllLocks();
        assert.ok(true);
    });

});
