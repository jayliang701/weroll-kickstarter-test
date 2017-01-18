/**
 * Created by Jay on 2017/1/13.
 */

var assert = require("assert");
var Model = require("weroll/model/Model");
var Session = require("weroll/model/Session").getSharedInstance();

describe('Session',function() {

    before(function (done) {
        //do something you need before run test cases.
        var config = {
            onePointEnter:true,
                cookiePath:"/",
                cacheExpireTime:500,  //sec
                tokenExpireTime:24 * 60 * 60,  //sec
                cookieExpireTime:24 * 60 * 60 * 1000  //million sec
        }
        Session.init(config);
        done();
    });

    var sess;

    it('save', async function(){
        var user = { _id:"1001", nickname:"Jay", type:100 };

        sess = await Session.save(user);
        assert(sess);
        assert.equal(sess.userid, user._id);
        assert.equal(sess.type, user.type);
    });

    it('check pass', async function(){
        var user = { _id:"1001", nickname:"Jay", type:100 };

        var result = await Session.check(sess.userid, sess.token);
        assert(result);
        assert.equal(result.userid, sess.userid);
        assert.equal(result.token, sess.token);
        assert.equal(result.tokentimestamp, sess.tokentimestamp);
        assert.equal(result.type, sess.type);
    });

    it('check fail', async function(){
        var result = await Session.check("123", sess.token);
        assert.equal(result, undefined);
    });

    it('expire', async function(){
        var config = {
            onePointEnter:true,
            cookiePath:"/",
            prefix:"test_test",
            cacheExpireTime:0.5, //sec
            tokenExpireTime:1,  //sec
            cookieExpireTime:24 * 60 * 60 * 1000  //million sec
        };
        var SessionClass = require("weroll/model/Session");
        var Session2 = new SessionClass();
        Session2.init(config);

        var user = { _id:"1002", nickname:"Tracy", type:100 };

        await Session2.remove({ userid:user._id, token:"D1NR8YxBCWrJ2da7"});

        var sess2 = await Session2.save(user);
        assert(sess2);
        assert.equal(sess2.userid, user._id);

        var result = await Session2.check(sess2.userid, sess2.token);
        assert(result);
        assert.equal(result.userid, sess2.userid);

        await sleep(1100);

        result = await Session2.check(sess2.userid, sess2.token);
        assert.equal(result, undefined);
    });

});