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
        /* setup Ecosystem if you need */
        var Ecosystem = require("weroll/eco/Ecosystem");
        Ecosystem.init();
       cb();
    });
});

app.addTask(async function (cb) {

    //test

    Ecosystem.callAPI("mini", "system.now", { format:1 }, function(err, data) {
        if (err) return console.error(err);
        console.log("mini response API: ", data);
    });

    var data = await Ecosystem.callAPI("mini", "system.now", { format:1 });
    console.log(data);

    //Promise
    Ecosystem.callAPI("mini", "system.now", { format:1 }).then(function(data) {
        console.log("mini response API: ", data);
    }).catch(function(err) {
        console.error(err);
    });

    var data1 = await Ecosystem.mini.callAPI("system.now", { format:1 });
    console.log("data1 ---> ", data1);

    Ecosystem.onServeReady("mini", function() {
        //mini application is registered in Ecosystem
        //setup message listeners
        Ecosystem.mini.listen("talk", function(data) {
            console.log("1. mini talk to you: ", data);
        });
    });

    Ecosystem.listen("mini", "talk", function(data) {
        console.log("2. mini talk to you: ", data);
    });

    Ecosystem.listenAll("talk", function(data, sender) {
        console.log("3. " + sender + " talk to you: ", data);
    });

    cb();
});

app.run();