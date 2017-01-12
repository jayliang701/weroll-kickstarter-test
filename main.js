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
app.addTask(async function () {
    await Model.DB.insert("Customer", { name:"Jay", gender:1, phone:"18621601670" });

    var doc = await Model.DB.findOne("Customer", { name:"Jay" });

    await Model.DB.insert("Customer", { name:"Heng", gender:1, phone:"18621601671" });
    doc = await Model.DB.find("Customer", { gender:1 });

    await Model.DB.insert("Customer", { name:"Heng", gender:1, phone:"18621601671" });
    doc = await Model.DB.find("Customer", { gender:1 });
});

app.run();