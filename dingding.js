const url = require('url')
const axios = require('axios')
const querystring = require('querystring')

function dingding(app, path, config, hook, toFrontEnd) {
    // @TODO check config *******************
    if (!config.appId) {
        throw new Error('no appId')
    }
    if (!config.appSecret) {
        throw new Error('no appSecret')
    }
    if (!config.state) {
        throw new Error('no state')
    }
    // *******************
    return new Promise((resolve, reject) => {
        try {
            var option = url.parse(config.redirectURL)

            // <a> link that user click
            app.get(path, function (req, res, next) {
                var arg = querystring.stringify({
                    appid: config.appId,
                    appSecret: config.appSecret,
                    redirect_uri: config.redirectURL,
                    response_type: config.responseType ? config.responseType : 'code',
                    scope: config.scope ? config.scope : 'snsapi_login',
                    state: config.state,
                })
                res.redirect('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?' + arg)
            })

            // redirect to which link from provider
            app.get(option.path, function (req, res, next) {
                var code = req.query.code
                var accessToken = ''
                console.log('code', code)
                //appid=APPID&appsecret=APPSECRET
                // 获取 access_token
                axios.get('https://oapi.dingtalk.com/sns/gettoken?', {
                    params: {
                        appid: config.appId,
                        appsecret: config.appSecret,
                    }
                }, { headers: { Accept: 'application/json' } })
                    .then(data => {
                        console.log('access_token', data.data)
                        /*
                            { errmsg: 'ok',
                            access_token: '860bc5f254ca3d3580c93f6321875d83',
                            errcode: 0 }
                        */
                        accessToken = data.data.access_token
                        // 利用 access_token 和 code 获取持久性 code
                        return axios.post('https://oapi.dingtalk.com/sns/get_persistent_code', {
                            tmp_auth_code: code
                        }, {
                            headers: { Accept: 'application/json' },
                            params: {access_token: accessToken,}
                        })
                    }).then(data => {
                        console.log('persistent code ', data.data)
                        /*
                            { persistent_code: '5556ORRN9elPsGviyZG4973Mf08U5oAEPptVNzmz3-heJ-ZpGLjmRGvVgcjrM4T3',
                            openid: 'EBHbx8YlS1KbIpniP7Bii9EQiEiE',
                            errmsg: 'ok',
                            unionid: 'U7y04pQcVUHTPBLTeoCgsQiEiE',
                            errcode: 0 }
                        */
                        var persistentCode = data.data.persistent_code
                        var openId = data.data.openid
                        return axios.post('https://oapi.dingtalk.com/sns/get_sns_token', {
                            openid: openId,
                            persistent_code: persistentCode
                        }, {
                            headers: { Accept: 'application/json' },
                            params: {
                                access_token: accessToken
                            }
                        })
                    }).then(data => {
                        console.log('sns_token', data.data)
                        var snsToken = data.data.sns_token
                        return axios.get('https://oapi.dingtalk.com/sns/getuserinfo', {
                            params: {
                            sns_token: snsToken
                            }
                        })
                    })
                    .then(data => {
                        hook(data.data)
                    }).then(() => {
                        res.redirect(toFrontEnd)
                    }).catch(err => {
                        console.log(err)
                    })

            })
            resolve(0)
        } catch (err) {
            // @TODO
            reject(err)
        }
    })
}

module.exports = dingding
