const url = require('url')
const axios = require('axios')
const querystring = require('querystring')

function oschina(app, path, config, hook, toFrontEnd) {
    // @TODO check config *******************
    if (!config.clientId) {
        throw new Error('no clientId')
    }
    if (!config.clientId) {
        throw new Error('no clientSecret')
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
                    client_id: config.clientId,
                    redirect_uri: config.redirectURL,
                    response_type: config.responseType ? config.responseType : 'code',
                    state: config.state,
                })
                res.redirect('https://www.oschina.net/action/oauth2/authorize?' + arg)
            })

            // redirect to which link from provider
            app.get(option.path, function (req, res, next) {
                var code = req.query.code
                // var refresh_token = 
                console.log('code', code)
                return axios.get('https://www.oschina.net/action/openapi/token', {
                    params: {
                        client_id: config.clientId,
                        client_secret: config.clientSecret,
                        grant_type: config.grantType ? config.grantType : 'authorization_code',
                        redirect_uri: config.redirectURL,
                        // refresh_token,
                        state: config.state,
                        dataType: config.dataType ? config.dataType : 'json',
                        code,
                        callback: config.callback ? config.callback : ''
                    }
                }).then(data => {
                    console.log('token', data.data)
                    var accessToken = data.data.access_token
                    // load user info from github on behalf of the user
                    return axios.get('https://www.oschina.net/action/openapi/user', {
                        params: {
                            access_token: accessToken,
                            dataType: config.dataType ? config.dataType : 'json',
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

module.exports = oschina