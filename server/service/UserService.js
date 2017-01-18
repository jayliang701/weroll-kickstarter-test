//./server/service/UserService.js
//配置这组API的前缀名和各个接口的参数定义
exports.config = {
    name: "user", //定义这组api的前缀名为user
    enabled: true,
    security: {
        //按照以下注释的写法，API调试工具可以自动识别这些说明并在工具中显示出来
        //@hello 打个招呼 @name 名字 @gender 性别,1-男,2-女
        "hello":{ needLogin:true, checkParams:{ name:"string" }, optionalParams:{ gender:"int" } },
        //@bye 说再见 @name 名字
        "bye":{ needLogin:false, optionalParams:{ name:"string" } }
    }
};

exports.hello = function(req, res, params) {
    var name = params.name;
    var gender = params.gender;
    res.sayOK({ msg:`欢迎, 你的名字是${name}, 性别是${gender == 1 ? "男" : "女"}` });
}

exports.bye = function(req, res, params) {
    var name = params.name || "陌生人";
    res.sayOK({ msg:`再见, ${name}` });
}