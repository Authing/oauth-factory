# oauth-factory
Integrate with third party OAuth providers. Use OAuth out of box.

集成了众多 OAuth 厂商，开箱即用的 OAuth 登录功能。

### 快速开始

安装依赖

`npm install express axios --save`

```
const express = require('express')
var app = express()
const OAuthFactory = require('./index.js')
var githubAuth = OAuthFactory('github')

githubAuth(app, '/auth/github', {
    clientId: 'c33213ad14962afa5840',
    clientSecret: '6c6c41465595b9db786984792b21c1b2caac288f',
    redirectURL: 'http://localhost:3000/code',
    state: Math.random().toString(26).slice(2),
    scope: '',
    allowSignup: true
}, function (userData, resolve, reject) {
    var t = new Promise((resolve, reject) =>{
        setTimeout(resolve, 10000)
    })
    t.then(()=>{
        console.log('hook', userData)
        resolve() // 调用 resolve 执行跳转前端并带上用户信息，调用 reject 会返回 400 错误，不携带用户信息
    })
}, 'http://localhost:8080/githubok')
```

OAuthFactory 可以根据输入生产不同的函数。函数有五个参数。
1. app 是 express 实例。
2. '/auth/github' 是前端 `<a>` 标签被点击后，处理请求的路由，可随意指定。
3. { ... } 对象是 OAuth 提供商的参数，一般包括 clientId, clientSecret, redirectURL, scope, state。一律遵循小驼峰命名。
4. `function(userData, resolve, reject) { }` 是钩子函数，用来处理获取到的用户信息，可以通过 resolve 返回处理后的信息给前端。
5. 'http://localhost:8080/githubok' OAuth 登录逻辑完成后将跳转到前端哪个页面。用户信息通过 `?data={ ... }` 的 query 返回。

# OAuth 提供商文档集合

### Github
[OAuth 文档](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)

[创建应用](https://github.com/settings/applications/new)


--------------------

### OSChina
[OAuth 文档](https://www.oschina.net/openapi/docs)

[创建应用](https://www.oschina.net/openapi/client/edit)

--------------------

### Stack Overflow
[OAuth 文档](https://api.stackexchange.com/docs/authentication)

[创建应用](https://stackapps.com/apps/oauth/register)

--------------------

### 钉钉
[OAuth 文档](https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.7f5f4a97IkrkFE&treeId=385&articleId=104968&docType=1#s1)

[创建应用](https://open-dev.dingtalk.com/#/loginAndShareApp)

--------------------

### 微信
[OAuth 文档](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419316505&token=&lang=zh_CN)

[创建应用](https://open.weixin.qq.com)

--------------------