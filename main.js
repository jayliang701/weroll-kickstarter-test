/**
 * Created by Jay on 14-4-30.
 */
var App = require("weroll/App");
var app = new App();

var Model = require("weroll/model/Model");

var Setting = global.SETTING;

app.addTask(function(cb) {
    Model.init(Setting.model, function(err) {
        cb(err);
    });
});
app.addTask(function(cb) {
    /* enable CORS
     */
     require("weroll/web/WebRequestPreprocess").inject("middle", function(req, res, next) {
         console.log('request header ---> cache-control: ', req.headers["cache-control"]);
         console.log('request cookie ---> identifyid : ', req.cookies.identifyid);
         next();
     });
    //create and start a web application
    var webApp = require("weroll/web/APIServer").createServer();
    webApp.start(Setting, function(webApp) {
        /* setup Ecosystem if you need
         */
        var Ecosystem = require("weroll/eco/Ecosystem");
        Ecosystem.init();
        cb();
    });
});

app.run();