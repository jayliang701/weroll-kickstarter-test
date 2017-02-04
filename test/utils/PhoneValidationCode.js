/**
 * Created by Jay on 2017/1/13.
 */

var assert = require("assert");
var Redis = require("weroll/model/Redis");
var TemplateLib = require("weroll/utils/TemplateLib");
var SMSUtil = require("weroll/utils/SMSUtil");
var PhoneValidationCode = require("weroll/utils/PhoneValidationCode");

describe('PhoneValidationCode',function() {

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

        var MyProxy = {};
        MyProxy.send = async function(phone, msg, option, callBack) {
            await sleep(20);
            callBack();
        };
        SMSUtil.setProxy(MyProxy);

        PhoneValidationCode.init();

        Redis.findKeysAndDel("*", function(err) {
            done(err);
        });
    });

    var phone = "18600000000"
    var code;

    //each it code block is a test case
    it('send 1', async function(){

        code = await PhoneValidationCode.send(phone, "test");

        assert(code);
        assert.equal(code.length, 6);
    });
    it('send 2', async function(){

        code = await PhoneValidationCode.send(phone, "test", { template:"test", enforce:true });

        assert(code);
        assert.equal(code.length, 6);
    });

    it('check fail', async function(){
        var isMatch = await PhoneValidationCode.check(phone, "test", "123456");
        assert.equal(isMatch, false);
    });

    it('check pass', async function(){
        var isMatch = await PhoneValidationCode.check(phone, "test", code);
        assert.equal(isMatch, true);
    });

    it('remove', async function(){
        await PhoneValidationCode.remove(phone, "test");
        assert.ok(true);

        var isMatch = await PhoneValidationCode.check(phone, "test", code);
        assert.equal(isMatch, false);
    });

    it('use', async function(){
        await PhoneValidationCode.use("test", code);
        assert.ok(true);

        var isMatch = await PhoneValidationCode.check("test", code);
        assert.equal(isMatch, false);
    });
});


