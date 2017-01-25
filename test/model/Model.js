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

    it('handle cache with config 1', async function(){
        var key = [ "test", "iam_a_cache_key_1" ];
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
        var key = [ "test", "iam_a_cache_key_2" ];
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
        var key = [ "test", "iam_a_cache_key_3" ];
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
        var key = [ "test", "iam_a_cache_key_4" ];
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

});