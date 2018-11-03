const github = require('./github')
const wechat = require('./wechat')
const stackoverflow = require('./stackoverflow')
const oschina = require('./oschina')

const OAuthFactory = function OAuthFactory(provider) {
    switch (provider) {
        case 'github':
            return github
            break
        case 'oschina':
            return oschina
            break;
        case 'stackoverflow':
            return stackoverflow
            break;
        case 'wechat':
            return wechat
            break;
    }

}
module.exports = OAuthFactory