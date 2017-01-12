/**
 * Created by Jay on 14-5-4.
 */
module.exports = {

    env:"localdev",

    host:"localhost",
    port:3100,

    model: {
        /* mongodb connection config */
        db: {
            host:"127.0.0.1",
            port:27017,
            name:"weroll_test",
            option: {}
        },
        /* */
        /* redis connection config */
        redis: {
            host:"127.0.0.1",
            port:6379,
            prefix:{
                "*": "weroll_test_",
                common: "weroll_test_common_"
            },
            ttl:24 * 60 * 60,  //sec,
            pass:"",
            maxLockTime:2 * 60,  //sec
            releaseLockWhenStart: true
        }
        /* */
    },

    session: {
        /* user access session config. enable redis first
        onePointEnter:true,
        cookiePath:"/",
        secret:"weroll123gowe",
        cacheExpireTime:3 * 60 * 1000,
        tokenExpireTime:24 * 60 * 60 * 1000,  //million sec
        cookieExpireTime:24 * 60 * 60 * 1000  //million sec
        */
    },

    upload: {
        url:"http://up.qiniu.com",
        ak:"2MEsbdrfmQEAfNo91hOEaXKXF1IYJUIttHgHV6ky",
        sk:"IyIiaNn66GsLnYzfr9b1r9gZD5_NI4qmLOOCi33A",
        private_bucket:"mars-er-private-media",
        public_bucket:"ugeez-jiban",
        download_bucket:"magicfish-download",
        private_download_live_time: 120,
        public_domain: "http://7xu8w0.com2.z0.glb.qiniucdn.com",
        private_domain: "7xidhb.com2.z0.glb.qiniucdn.com",
        download_domain: "http://7xoyvk.dl1.z0.glb.clouddn.com"
    },

    site:"http://localhost:3100/",
    siteName:"weroll_mini",
    /* mail service config
    mail: {
        stamp: {
            user:"developer@magicfish.cn",
            password:"aabbcc",
            host:"smtp.xxxxx.com",
            port:465,
            ssl:true
        },
        sender:"developer@magicfish.cn",
        senderName:"developer"
    },
    */
    /* SMS service config
    sms:{
        api:"http://utf8.sms.webchinese.cn/?Uid=淘迪叔叔",
        secret:"87854cc77db024eddf72",
        limit: {
            length:70,
            duration:1,
            maxPerDay:9999999
        },
        validationCodeExpireTime:300
    },
    */
    cdn:{
        res:"http://localhost:3100"
    },

    ecosystem: {
        name: "weroll_mini",
        port: 3001,
        servers : {
            "another_weroll_app" : {
                message:"127.0.0.1:3004",
                api:"127.0.0.1:3002/api"
            }
        }
    }
};
