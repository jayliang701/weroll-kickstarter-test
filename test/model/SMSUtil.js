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
            api:"http://utf8.sms.webchinese.cn/?Uid=淘迪叔叔",
            secret:"87854cc77db024eddf72",
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
});