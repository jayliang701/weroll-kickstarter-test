/**
 * Created by Jay on 2016/3/4.
 */

var Initor = require("../../server/tools/UnitTestInitor");
var assert = require("assert");
var Model = require("weroll/model/Model");

describe('0',function() {

    before(function (done) {
        //do something you need before run test cases.
        done();
    });

    //each it code block is a test case
    it('Model.init', function(done){
        Model.init(global.SETTING.model, function(err) {
            assert.equal(err, undefined);
            done();
        });
    });

});