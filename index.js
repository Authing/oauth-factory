/*

var auth = OAuthFactory('github')
auth(app, '/auth/github', {
    clientId: '',
    clientSecret: '',
    redirectURL: '',
    state: '',
    scope: '',
    allowSignup: true
}, function hook(){}, 'http://localhost:8080/ok').then(data => {

}).catch(err => {

})
*/
const url = require('url')
const axios = require('axios')
const querystring = require('querystring')
const OAuthFactory = function OAuthFactory(provider) {
    switch (provider) {
        case 'github':
            return function github(app, path, config, hook, toFrontEnd) {
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

                        // <a> link that user click
                        app.get(path, function (req, res, next) {
                            var arg = querystring.stringify({
                                client_id: config.clientId,
                                redirect_uri: config.redirectURL,
                                scope: config.scope,
                                state: config.state,
                                allow_signup: config.allowSignup ? 'true' : false
                            })
                            res.redirect('https://github.com/login/oauth/authorize?' + arg)
                        })

                        // redirect to which link from provider
                        app.get(option.path, function (req, res, next) {
                            var code = req.query.code
                            console.log('code', code)
                            axios.post('https://github.com/login/oauth/access_token', {
                                client_id: config.clientId,
                                client_secret: config.clientSecret,
                                redirect_uri: config.redirectURL,
                                state: config.state,
                                code,
                            }, { headers: { Accept: 'application/json' } }).then(data => {
                                console.log(data.data)
                                var accessToken = data.data.access_token
                                // load user info from github on behalf of the user
                                return axios.get('https://api.github.com/user', { headers: { Authorization: 'token ' + accessToken } })

                            }).then(data => {
                                hook(data.data)
                            })
                                .then(() => {
                                    res.redirect(toFrontEnd)
                                })
                                .catch(err => {
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
            break
        case 'oschina':
            return function oschina(app, path, config, hook, toFrontEnd) {
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
                            axios.get('https://www.oschina.net/action/openapi/token', {
                                client_id: config.clientId,
                                client_secret: config.clientSecret,
                                grant_type: config.grantType ? config.grantType : 'authorization_code',
                                redirect_uri: config.redirectURL,
                                // refresh_token,
                                state: config.state,
                                dataType: config.dataType ? config.dataType : 'json',
                                code,
                                callback: config.callback ? config.callback : ''
                            }).then(data => {
                                console.log('token', data.data)
                                var accessToken = data.data.access_token
                                // load user info from github on behalf of the user
                                return axios.get('https://www.oschina.net/action/openapi/user', {
                                    access_token: accessToken,
                                    dataType: config.dataType ? config.dataType : 'json',
                                })

                            }).then(data => {
                                hook(data.data)
                            }).then(() => {
                                res.redirect(toFrontEnd)
                            })
                                .catch(err => {
                                    console.log('token err ', err)
                                })

                        })
                        resolve(0)
                    } catch (err) {
                        // @TODO
                        reject(err)
                    }
                })
            }
            break;
        case 'stackoverflow':
            return function github(app, path, config, hook, toFrontEnd) {
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
                if (!config.key) {
                    throw new Error('no key')
                }
                // *******************
                return new Promise((resolve, reject) => {
                    try {
                        var option = url.parse(config.redirectURL)

                        // <a> link that user click
                        app.get(path, function (req, res, next) {
                            var arg = querystring.stringify({
                                client_id: config.clientId,
                                redirect_uri: config.redirectURL,
                                scope: config.scope,
                                state: config.state,
                            })
                            res.redirect('https://stackoverflow.com/oauth?' + arg)
                        })

                        // redirect to which link from provider
                        app.get(option.path, function (req, res, next) {
                            var code = req.query.code
                            console.log('code', code)
                            axios.post('https://stackoverflow.com/oauth/access_token/json', {
                                client_id: config.clientId,
                                client_secret: config.clientSecret,
                                redirect_uri: config.redirectURL,
                                // state: config.state,
                                code,
                            }, { headers: { Accept: 'application/json' } }).then(data => {
                                console.log(data.data)
                                var accessToken = data.data.access_token
                                // load user info from github on behalf of the user
                                return axios.get('https://api.stackexchange.com/2.2/me', {
                                    params: {
                                        access_token: accessToken,
                                        key: config.key,
                                        site: 'stackoverflow'
                                    }
                                })

                            }).then(data => {
                                hook(data.data.items[0])
                            })
                                .then(() => {
                                    res.redirect(toFrontEnd)
                                })
                                .catch(err => {
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
            break;
    }

}
module.exports = OAuthFactory