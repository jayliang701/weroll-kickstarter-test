/**
 * Created by Jay on 2017/1/13.
 */

var assert = require("assert");
var Redis = require("weroll/model/Redis");
var SMSUtil = require("weroll/utils/SMSUtil");
var TemplateLib = require("weroll/utils/TemplateLib");

describe('SMSUtil',function() {

    before(function (done) {
        //do something you need before run test cases.
        var config = {
            limit: {
                duration:1000,   //milli sec
                maxPerDay:2
            },
            simulate:true   //
        };
        SMSUtil.init(config);

        TemplateLib.init({ site:"weroll" });

        Redis.findKeysAndDel("*", function(err) {
            done(err);
        });
    });

    var phone = "18600000000";

    //each it code block is a test case
    it('send', async function(){
        await SMSUtil.send(phone, "welcome");
        assert.ok(true);
    });

    it('send too fast', async function(){
        try {
            await SMSUtil.send(phone, "welcome");
            assert.ok(false);
        } catch (err) {
            assert.ok(true);
        }
        await sleep(1100);
    });

    it('send over limit', async function(){
        await SMSUtil.send(phone, "welcome");
        assert.ok(true);

        await sleep(1100);

        try {
            await SMSUtil.send(phone, "welcome");
        } catch (err) {
            //console.error(err);
            return assert.ok(true);
        }
        assert.ok(false);
    });

    it('send enforce', async function(){
        await SMSUtil.send(phone, "welcome", { enforce:true });
        assert.ok(true);

        await SMSUtil.send(phone, "welcome", { enforce:true });
        assert.ok(true);

        await SMSUtil.send(phone, "welcome", { enforce:true });
        assert.ok(true);
    });

    it('sendWithTemplate', async function() {
        await SMSUtil.sendWithTemplate(phone, "test", { name:"Jay" }, { enforce:true });
        assert.ok(true);
    });

    it('custom proxy', function(done) {
        var flag = false;
        var MyProxy = {};
        MyProxy.send = async function(phone, msg, option, callBack) {
            await sleep(50);
            assert(phone);
            assert(msg);
            flag = true;
            callBack();
        };
        SMSUtil.setProxy(MyProxy);
        SMSUtil.send(phone, "welcome", { enforce:true, simulate:false }, function(err) {
            assert.equal(err, undefined);
            assert.equal(flag, true);
            done();
        });
    });
});