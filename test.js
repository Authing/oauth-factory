const express = require('express')
var app = express()
const OAuthFactory = require('./index.js')
var githubAuth = OAuthFactory('github')
var oschinaAuth = OAuthFactory('oschina')
var stackoverflow = OAuthFactory('stackoverflow')
var wechatAuth = OAuthFactory('wechat')


stackoverflow(app, '/auth/stackoverflow', {
    clientId: '13491',
    clientSecret: ')eUGlJ9zTtY1BmsGJAsKIQ((',
    redirectURL: 'http://localhost:3000/handleOAuth/stackoverflow',
    key: 'Bc9CleGdu2iTb67dr2risQ((',
    state: Math.random().toString(26).slice(2),
    scope: '',
}, function (userData) {
    console.log('hook ', JSON.stringify(userData))
}, 'http://localhost:8080/stackoverflowok')

githubAuth(app, '/auth/github', {
    clientId: 'c33213ad14962afa5840',
    clientSecret: '6c6c41465595b9db786984792b21c1b2caac288f',
    redirectURL: 'http://localhost:3000/code',
    state: Math.random().toString(26).slice(2),
    scope: '',
    allowSignup: true
}, function (userData) {
    console.log('hook ', userData)
}, 'http://localhost:8080/ojbk')

// wechatAuth(app, '/auth/wechat', {
//     appId: '',
//     secret: '',
//     redirectURL: '',
//     state: Math.random().toString(26).slice(2),
// }, function (userData) {
//     console.log(userData)
// }, 'http://localhost:8080/wechatok')

oschinaAuth(app, '/auth/oschina', {
    clientId: '3Xsh3OyJ978fsPHs5oAs',
    clientSecret: 'Xi8XMFjqwlIg1R4bDzyrOvl9OlWvnvm7',
    redirectURL: 'http://localhost:3000/oauth/oschina',
    state: Math.random().toString(26).slice(2),
}, function (userData) {
    console.log('hook ', userData)
}, 'http://localhost:8080/ojbk')

app.listen(3000, () => console.log('Example app listening on port 3000!'))