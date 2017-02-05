/**
 * Created by Jay on 2017/1/13.
 */

var assert = require("assert");
var Redis = require("weroll/model/Redis");
var MailUtil = require("weroll/utils/MailUtil");
var TemplateLib = require("weroll/utils/TemplateLib");

describe('MailUtil',function() {

    before(function (done) {
        //do something you need before run test cases.
        Redis.findKeysAndDel("*", function(err) {
            done(err);
        });
    });

    //each it code block is a test case
    it('init', async function(){
        var config = {
            smtp:{
                user:"developer@magicfish.cn",
                password:"xxxxxxxxx",
                host:"smtp.xxxx.com",
                port:465,
                ssl:true
            },
            sender:"developer@magicfish.cn",
            senderName:"Robot",
            simulate:true
        };
        MailUtil.init(config);
        assert.ok(true);
    });

    it('send', async function(){
        try {
            await MailUtil.send("xxxxxx@qq.com", "Hello", "Hi user, xxxxx...");
            assert.ok(true);
        } catch (exp) {
            assert.equal(exp, undefined);
        }
    });

    it('send as html', async function(){
        try {
            var content = {
                plain:"Hi user,\r\nxxxxx...",
                html:"Hi user,<br>xxxxx..."
            };
            await MailUtil.send("xxxxxx@qq.com", "Hello", content);
            assert.ok(true);
        } catch (exp) {
            assert.equal(exp, undefined);
        }
    });

    it('send with template', async function(){
        try {
            await MailUtil.sendWithTemplate("xxxxxx@qq.com", "welcome");
            assert.ok(true);
        } catch (exp) {
            assert.equal(exp, undefined);
        }
    });
});