const express = require('express')
var app = express()
const OAuthFactory = require('./index.js')
var githubAuth = OAuthFactory('github')
var oschinaAuth = OAuthFactory('oschina')
var stackoverflow = OAuthFactory('stackoverflow')
var wechatAuth = OAuthFactory('wechat')
var dingdingAuth = OAuthFactory('dingding')

dingdingAuth(app, '/auth/dingding', {
    appId: 'dingoad1iwmifcjsrjpprn',
    appSecret: 'OOQcaO7ER2pT19gpqQDWJfoVKTrvL_JSr28F9Namn-cnT5vCCHHHg4e9CNRAb660',
    redirectURL: 'http://localhost:3000/oauth/dingding/redirect',
    state: Math.random().toString(26).slice(2),
}, function (userData, resolve, reject) {
    var t = new Promise((resolve, reject) =>{
        setTimeout(resolve, 10000)
    })
    t.then(()=>{
        console.log('hook', userData)
        resolve()
    })
}, 'http://localhost:8080/dingdingOk')
stackoverflow(app, '/auth/stackoverflow', {
    clientId: '13491',
    clientSecret: ')eUGlJ9zTtY1BmsGJAsKIQ((',
    redirectURL: 'http://localhost:3000/oauth/stackoverflow/redirect',
    key: 'Bc9CleGdu2iTb67dr2risQ((',
    state: Math.random().toString(26).slice(2),
    scope: '',
}, function (userData, resolve, reject) {
    var t = new Promise((resolve, reject) =>{
        setTimeout(resolve, 10000)
    })
    t.then(()=>{
        console.log('hook', userData)
        resolve()
    })
}, 'http://localhost:8080/stackoverflowOk')

githubAuth(app, '/auth/github', {
    clientId: 'c33213ad14962afa5840',
    clientSecret: '6c6c41465595b9db786984792b21c1b2caac288f',
    redirectURL: 'http://localhost:3000/oauth/github/redirect',
    state: Math.random().toString(26).slice(2),
    scope: '',
    allowSignup: true
}, function (userData, resolve, reject) {
    var t = new Promise((resolve, reject) =>{
        setTimeout(resolve, 10000)
    })
    t.then(()=>{
        console.log('hook', userData)
        resolve()
    })
}, 'http://localhost:8080/githubOk')

// wechatAuth(app, '/auth/wechat', {
//     appId: '',
//     secret: '',
//     redirectURL: '',
//     state: Math.random().toString(26).slice(2),
// },  function (userData, resolve, reject) {
//     var t = new Promise((resolve, reject) =>{
//         setTimeout(resolve, 10000)
//     })
//     t.then(()=>{
//         console.log('hook', userData)
//         resolve()
//     })
// }, 'http://localhost:8080/wechatOk')

oschinaAuth(app, '/auth/oschina', {
    clientId: '3Xsh3OyJ978fsPHs5oAs',
    clientSecret: 'Xi8XMFjqwlIg1R4bDzyrOvl9OlWvnvm7',
    redirectURL: 'http://localhost:3000/oauth/oschina/redirect',
    state: Math.random().toString(26).slice(2),
}, function (userData, resolve, reject) {
    var t = new Promise((resolve, reject) =>{
        setTimeout(resolve, 10000)
    })
    t.then(()=>{
        console.log('hook', userData)
        resolve()
    })
}, 'http://localhost:8080/oschinaOk')

app.listen(3000, () => console.log('Example app listening on port 3000!'))