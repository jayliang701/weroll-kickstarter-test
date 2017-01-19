/**
 * Created by Jay on 2017/1/13.
 */

var assert = require("assert");
var AuthorityChecker = require("weroll/utils/AuthorityChecker");

describe('SMSUtil',function() {

    before(function (done) {
        //do something you need before run test cases.
        done();
    });

    //each it code block is a test case
    it('check - type : passed', function(done){
        var allow = [ [ "type",[1,2] ] ];
        var user = { type:1 };
        AuthorityChecker.check(user, allow, function(err, result) {
            assert.equal(err, undefined);
            assert.equal(result, true);
            done();
        });
    });

    it('check - type : failed', function(done){
        var allow = [ [ "type",[1,2] ] ];
        var user = { type:3 };
        AuthorityChecker.check(user, allow, function(err, result) {
            assert(err);
            assert.equal(result, false);
            done();
        });
    });

    it('check - custom : passed', function(done){
        var allow = [ [ "custom",{ vipLevel:" >= 3" } ] ];
        var user = { vipLevel:10 };

        var vipLevelCheck = function(user, allow, callBack) {
            //eval("1 >= 3")
            var result = eval(user.vipLevel + allow.vipLevel);
            callBack(result);
        }

        AuthorityChecker.register("custom", vipLevelCheck);

        AuthorityChecker.check(user, allow, function(err, result) {
            assert.equal(err, undefined);
            assert.equal(result, true);
            done();
        });
    });

    it('check - custom : failed', function(done){
        var allow = [ [ "custom",{ vipLevel:" >= 3" } ] ];
        var user = { vipLevel:1 };

        var vipLevelCheck = function(user, allow, callBack) {
            //eval("1 >= 3")
            var result = eval(user.vipLevel + allow.vipLevel);
            callBack(result);
        }

        AuthorityChecker.register("custom", vipLevelCheck);

        AuthorityChecker.check(user, allow, function(err, result) {
            assert(err);
            assert.equal(result, false);
            done();
        });
    });
});