/**
 * Created by Jay on 2017/1/13.
 */

var assert = require("assert");
var TemplateLib = require("weroll/utils/TemplateLib");

describe('TemplateLib',function() {

    before(function (done) {
        //do something you need before run test cases.
        TemplateLib.init({ site:"weroll" });
        done();
    });

    //each it code block is a test case
    it('use', async function(){
        var name = "++Jay++";
        var template = TemplateLib.useTemplate("sms", "test", { name:name });
        assert(template);
        assert.equal(template.title, "");
        assert.equal(template.content.indexOf(name) >= 0, true);
        assert.equal(template.content.indexOf("weroll") >= 0, true);
    });

    it('use with title', async function(){
        var name = "++Jay++";
        var template = TemplateLib.useTemplate("mail", "welcome", { name:name });
        assert(template);
        assert.equal(template.title.indexOf(name) >= 0, true);
        assert.equal(template.content.indexOf(name) >= 0, true);
        assert.equal(template.content.indexOf("weroll") >= 0, true);
    });
});


