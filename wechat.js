const url = require('url')
const axios = require('axios')
const querystring = require('querystring')

function wechat(app, path, config, hook, toFrontEnd) {
    // @TODO check config *******************
    if (!config.appId) {
        throw new Error('no appId')
    }
    if (!config.secret) {
        throw new Error('no secret')
    }
    if (!config.state) {
        throw new Error('no state')
    }
   
    // *******************
    return new Promise((resolve, reject) => {
        try {
            var option = url.parse(config.redirectURL)
            var userData = {}
            // <a> link that user click
            app.get(path, function (req, res, next) {
                var arg = querystring.stringify({
                    appid: config.appId,
                    redirect_uri: config.redirectURL,
                    scope: config.scope ? config.scope : 'snsapi_login',
                    response_type: config.responseType ? config.responseType : 'code',
                    state: config.state,
                })
                res.redirect('https://open.weixin.qq.com/connect/qrconnect?' + arg)
            })

            // redirect to which link from provider
            app.get(option.path, function (req, res, next) {
                var code = req.query.code
                console.log('code', code)
                axios.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
                    params: {
                        appid: config.appId,
                        secret: config.secret,
                        // state: config.state,
                        grant_type: 'authorization_code',
                        code,
                    }
                }).then(data => {
                    console.log('access_token ', data.data)
                    var accessToken = data.data.access_token
                    // load user info from github on behalf of the user
                    return axios.get('https://api.weixin.qq.com/sns/userinfo', {
                        params: {
                            access_token: accessToken,
                            openid: data.data.openid
                        }
                    })

                }).then(data => {
                    userData = data.data
                    return new Promise((resolve, reject) => {
                        hook(userData, resolve, reject)
                    })
                }).then(data => {
                    if (data) {
                        return data
                    }
                    return userData
                }).then((data) => {
                    var arg = JSON.stringify(data)
                    res.redirect(toFrontEnd + '?data=' + arg)
                }).catch(err => {
                    console.log(err)
                    res.status(400).send('Bad request')

                })

            })
            resolve(0)
        } catch (err) {
            // @TODO
            reject(err)
        }
    })
}

module.exports = wechat
