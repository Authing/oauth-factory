const express = require('express')
var app = express()
const OAuthFactory = require('./index.js')
var auth = OAuthFactory('github')
auth(app, '/auth/github', {
    clientId: 'c33213ad14962afa5840',
    clientSecret: '6c6c41465595b9db786984792b21c1b2caac288f',
    redirectURL: 'http://localhost:3000/code',
    state: Math.random().toString(26).slice(2),
    scope: '',
    allowSignup: true
}, function (userData){
    console.log('hook ', userData)
}, 'http://localhost:8080/ojbk')

app.listen(3000, () => console.log('Example app listening on port 3000!'))