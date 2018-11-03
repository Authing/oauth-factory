const url = require('url')
const axios = require('axios')
const querystring = require('querystring')

function stackoverflow(app, path, config, hook, toFrontEnd) {
    // @TODO check config *******************
    if (!config.clientId) {
        throw new Error('no clientId')
    }
    if (!config.clientSecret) {
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
            var userData = {}
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

module.exports = stackoverflow