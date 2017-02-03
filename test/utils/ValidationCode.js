/**
 * Created by Jay on 2017/1/13.
 */

var assert = require("assert");
var VCode = require("weroll/utils/ValidationCode");

describe('ValidationCode',function() {

    before(function (done) {
        //do something you need before run test cases.
        done();
    });

    var vc;
    var code;

    //each it code block is a test case
    it('send', async function(){

        vc = new VCode();
        code = await vc.generate("test");

        assert(code);
        assert.equal(code.length, 6);
    });

    it('check fail', async function(){
        var isMatch = await vc.check("test", "123456");
        assert.equal(isMatch, false);
    });

    it('check pass', async function(){
        var isMatch = await vc.check("test", code);
        assert.equal(isMatch, true);
    });

    it('remove', async function(){
        await vc.remove("test");
        assert.ok(true);

        var isMatch = await vc.check("test", code);
        assert.equal(isMatch, false);
    });

    it('generate - custom length', async function(){
        code = await vc.generate("test", { len:10 });

        assert(code);
        assert.equal(code.length, 10);

        var isMatch = await vc.check("test", code);
        assert.equal(isMatch, true);
    });

    it('use', async function(){
        await vc.use("test", code);
        assert.ok(true);

        var isMatch = await vc.check("test", code);
        assert.equal(isMatch, false);
    });

    it('generate - custom pattern', async function(){
        code = await vc.generate("test", { len:10, pattern:[ ["A", "Z"] ] });

        assert(code);
        assert.equal(code.length, 10);
        assert.equal(code.match(/[A-Z]*/)[0], code);

        var isMatch = await vc.check("test", code);
        assert.equal(isMatch, true);
    });

    it('generate - expire', async function(){
        code = await vc.generate("test", { expire:1 });

        assert(code);

        await sleep(1100);

        var isMatch = await vc.check("test", code);
        assert.equal(isMatch, false);
    });

    it('simulate', async function(){
        vc = new VCode({ simulate:true });
        code = await vc.generate("test");

        assert(code);
        assert.equal(code.length, 6);

        var isMatch = await vc.check("test", "123456");
        assert.equal(isMatch, true);
    });
});


