/**
 * Created by Jay on 2017/1/13.
 */

var assert = require("assert");
var Model = require("weroll/model/Model");

describe('Model',function() {

    before(function (done) {
        //do something you need before run test cases.
        done();
    });

    //each it code block is a test case
    it('cacheSave', async function(){
        var val = "Jay";
        var result = await Model.cacheSave("name", val);
        assert(result);
        assert.equal(result, val);
    });

    it('cacheSave with callback', function(done){
        var val = "Jay";
        Model.cacheSave("name", val, function(err, result) {
            assert.equal(err, undefined);
            assert(result);
            assert.equal(result, val);
            done();
        });
    });

    it('cacheRead', async function(){
        var val = "Jay";
        var result = await Model.cacheRead("name");
        assert(result);
        assert.equal(result, val);
    });

    it('cacheRead with callback', function(done){
        var val = "Jay";
        Model.cacheRead("name", 1, function(err, result) {
            assert.equal(err, undefined);
            assert(result);
            assert.equal(result, val);
            done();
        });
    });

    it('cacheSave with expire', async function(){
        var val = "Tracy";
        var result = await Model.cacheSave("name", val, 1);  //expire after 1 sec
        assert(result);
        assert.equal(result, val);

        await sleep(1200);

        result = await Model.cacheRead("name");
        assert.equal(result, undefined);
    });

    it('cacheSave in level 2', async function(){
        var val = "High";
        var result = await Model.cacheSave("class", val, null, 2);
        assert(result);
        assert.equal(result, val);
    });

    it('cacheSave object', async function(){
        var val = { name:"Jay" };
        var result = await Model.cacheSave("user", val, null, 1);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheSave("user", val, null, 2);
        assert(result);
        assert.equal(result, val);
    });

    it('cacheRead object', async function(){
        var val = { name:"Jay" };
        var result = await Model.cacheRead("user", 1);
        assert(result);
        assert.equal(result.name, val.name);

        result = await Model.cacheRead("user", 2);
        assert(result);
        assert.equal(result.name, val.name);
    });

    it('cacheRemove', async function(){
        var val = { name:"Jay" };
        var result = await Model.cacheSave("user", val, null, 1);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead("user", 1);
        assert(result);
        assert.equal(result.name, val.name);

        await Model.cacheRemove("user", 1);

        result = await Model.cacheRead("user", 1);
        assert.equal(result, undefined);
    });

    it('handle cache with config general', async function(){
        var key = [ "name", "100001" ];
        var val = "Jay";
        var result = await Model.cacheSave(key, val);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead(key);
        assert(result);
        assert.equal(result, val);

        await sleep(1200);

        result = await Model.cacheRead(key);
        assert.equal(result, undefined);
    });

    it('handle cache with config 1', async function(){
        var key = "test.iam_a_cache_key_1";
        var val = "Jay";
        var result = await Model.cacheSave(key, val);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead(key, 1);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead(key, 2);
        assert(result);
        assert.equal(result, val);
    });

    it('handle cache with config 2', async function(){
        var key = "test.iam_a_cache_key_2";
        var val = "Jay";
        var result = await Model.cacheSave(key, val);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead(key, 1);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead(key, 2);
        assert.equal(result, undefined);
    });

    it('handle cache with config 3', async function(){
        var key = "test.iam_a_cache_key_3";
        var val = "Jay";
        var result = await Model.cacheSave(key, val);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead(key, 1);
        assert.equal(result, undefined);

        result = await Model.cacheRead(key, 2);
        assert(result);
        assert.equal(result, val);
    });

    it('handle cache with config 4', async function(){
        var key = "test.iam_a_cache_key_4";
        var val = "Jay";
        var result = await Model.cacheSave(key, val);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead(key, 1);
        assert(result);
        assert.equal(result, val);

        await sleep(250);

        result = await Model.cacheRead(key, 1);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead(key, 2);
        assert(result);
        assert.equal(result, val);

        await sleep(1000);

        result = await Model.cacheRead(key, 1);
        assert.equal(result, undefined);

        result = await Model.cacheRead(key, 2);
        assert.equal(result, undefined);
    });

    it('handle cache which save as level 0', async function(){
        var key = "level0";
        var val = "Tracy";
        var result = await Model.cacheSave(key, val, null, 0);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead(key, 1);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead(key, 2);
        assert(result);
        assert.equal(result, val);

        await Model.cacheRemove(key);

        result = await Model.cacheRead(key, 1);
        assert.equal(result, undefined);

        result = await Model.cacheRead(key, 2);
        assert.equal(result, undefined);
    });

    it('custom cache handler', async function() {

        var fs = require("fs");
        var path = require("path");
        var mkdirp = require("mkdirp");
        var del = require("del");

        var CACHE_FOLDER = path.join(__dirname, '../.tmp');

        //clean cache folder
        try {
            await del(CACHE_FOLDER);
        } catch (exp) { }

        //remake cache folder
        var err;
        try {
            await (function() {
                return new Promise(function(resolve, reject) {
                    mkdirp(CACHE_FOLDER, function(err) {
                        err ? reject(err) : resolve();
                    });
                });
            })();
        } catch (exp) {
            err = exp;
        }
        assert.equal(err, undefined);

        var FileCache = {};
        FileCache.setExpireTime = function(key, val) {
            //暂不实现
        }

        FileCache.registerExpiredTime = function(key, expireTime) {
            //暂不实现
        }

        FileCache.save = function(key, val, expireTime, callBack) {
            return new Promise(function(resolve, reject) {
                if (key instanceof Array) key = key.join(".");
                var cache = typeof val == "object" ? JSON.stringify(val) : val;
                fs.writeFile(path.join(CACHE_FOLDER, key), cache, { encoding:"utf8" }, function(err) {
                    if (callBack) return callBack(err, val);
                    err ? reject(err) : resolve(val);
                });
            });
        }

        FileCache.read = function(key, callBack) {
            return new Promise(function(resolve, reject) {
                if (key instanceof Array) key = key.join(".");
                fs.readFile(path.join(CACHE_FOLDER, key), { encoding:"utf8" }, function(err, cache) {
                    if (err && err.code == "ENOENT") {
                        //file is not exist
                        err = null;
                        cache = null;
                    }
                    var val = cache;
                    if (val) {
                        try {
                            val = JSON.parse(cache);
                        } catch (exp) {
                            //it is a non-object value
                            val = cache;
                        }
                    }
                    if (callBack) return callBack(err, val);
                    err ? reject(err) : resolve(val);
                });
            });
        }

        FileCache.remove = function(key, callBack) {
            return new Promise(function(resolve, reject) {
                if (key instanceof Array) key = key.join(".");
                fs.unlink(path.join(CACHE_FOLDER, key), function(err) {
                    if (err && err.code == "ENOENT") {
                        //no such file, ignores this error
                        err = null;
                    }
                    if (callBack) return callBack(err);
                    err ? reject(err) : resolve();
                });
            });
        }

        Model.registerCacheSystem(3, FileCache);

        //start test FileCache
        var val = { name:"Jay" };
        var result = await Model.cacheSave("user", val, null, 3);
        assert(result);
        assert.equal(result, val);

        result = await Model.cacheRead("user", 3);
        assert(result);
        assert.equal(result.name, val.name);

        await Model.cacheRemove("user", 3);

        result = await Model.cacheRead("user", 3);
        assert.equal(result, undefined);

        await Model.cacheRemove("user", 3);
    });

});