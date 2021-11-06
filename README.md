# 跨域是个什么鬼

跨域是个老生常谈的话题了，最近不管在和后端联调，或者搞微前端的时候都会遇到，正好写篇文章来总结一下吧。

## 跨域是什么

这里的“跨域”指的是不同源之间的资源访问。只要请求的 url 有以下不同，都属于“跨域”：
* 协议: http, https, ...
* 域名
* 端口

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fa5fad340c64001b6c4dddeedbe3430~tplv-k3u1fbpfcp-watermark.image?)

有人可能会觉得，我自己网站肯定只访问自己服务器，肯定都是部署在一个域名的呀。

但是有的时候，一个网页可能要对接后端多个服务：一会对接支付，一会对接用户信息。每个组的后端可能都会有自己的域名。在这样的场景下，跨域就非常常见了。

## 为什么会有跨域

我们常说的“跨域”问题，其实是在说“跨域”访问的限制问题，相信大家对下面的报错习以为常了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1aa693d67e6045fd9155c20e49d8add0~tplv-k3u1fbpfcp-watermark.image?)

这种“跨域”限制其实是 **浏览器自带的安全机制**，只有 **在浏览器上** 发生跨域请求操作时，浏览器就会自动抛出上面的错误。

注意，这仅在浏览器上会出现这样的限制，如果你用 Postman 这些工具访问 url 是没有“跨域”限制的，毕竟 Postman 连域名这些玩意都没有，哪来的“跨域”。

## CORS

虽然浏览器出于安全考虑做了“跨域”访问的限制，但开发时不可避免会有这样不同源资源访问的需求，因此 W3C 就制定了 **CORS(Cross-origin resource sharing 跨域资源共享)** 的机制。

> 很多人一直以为 CORS = 跨域，其实 CORS 是一种解决“跨域”的方案。

需要注意的是，CORS 是一个“新”的协议（至少对于以前的 IE7 是新的），不仅需要浏览器支持，也后端服务器的支持。

浏览器支持没什么好说的，就是浏览器版本是否支持的问题：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2235c43f15044d5bb5b7520d3ef22da~tplv-k3u1fbpfcp-watermark.image?)

然后就是后端服务器支持了，**服务器需要在 Response Header 上添加 Access-Control-xxx-yyy** 的字段，浏览器识别到了，才能放行该请求。比如，最常见的就是加 **Access-Control-Allow-Origin** 这个返回头，值设置为需要放行的域名。

### 简单请求 VS 非简单请求

浏览器将 CORS 请求分为 **简单请求** 和 **非简单请求**。

**简单请求** 会在发送时自动在 HTTP 请求头加上 `Origin` 字段，来标明当前是哪个源（协议+域名+端口），服务端来决定是否放行。

**非简单请求** 则会先发一个 `OPTIONS` 预检请求给服务端，当通过了再发正常的 CORS 请求。

对于 **简单请求**，请求方法为以下三种之一：
* `Head`
* `Post`
* `Get`

且 HTTP 请求头字段不能超过以下字段：

* `Accept`
* `Accept-Language`
* `Content-Language`
* `Last-Event-ID`
* `Content-Type`

同时 Content-Type 只能三个值：
* `application/x-www-form-urlencoded` 对应普通表单
* `multipart/form-data` 对应文件上传
* `text/plain` 对应文本发送（一般不怎么用）

只要不满足上面条件的，都属于 **非简单请求**。

> 可能很多人会自然地觉得 POST 请求都是 **非简单请求**，因为我们常看到发 POST 时，都会先发 OPTIONS。其实是因为我们一般都会传 JSON 格式的数据，Content-Type 为 `application/json`，所以，这样的 POST 请求才属于 **非简单请求**。

### Access-Control-xxx-yyyy

当 CORS 请求为 **简单请求时**，请求会检测返回头里的以下字段：

* **Access-Control-Allow-Origin**：指定哪些源是可以共享资源的（包含协议、域名、端口）。
* **Access-Control-Allow-Credentials**：当请求需要携带 Cookie 时，需要加上这个字段为 `true` 才能允许携带 Cookie。
* **Access-Control-Expose-Headers**：由于 `XMLHttpRequest` 对象只能拿到 `Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma` 这 6 个基本字段。想要在拿到别的字段，就需要在这里去指定。

而当 CORS 请求为 **非简单请求时**，浏览器会先发一个 `OPTIONS` 预检（preflight）请求，这个请求会检查如下字段：
* **Access-Control-Request-Method**：指定可访问的方法，对于非简单请求，可能会用到 `PUT`，`PATCH`，`DELETE` 等 RESTful 方法，服务端需要把这些方法名也加上。
* **Access-Control-Request-Headers**：指定 HTTP 请求头会额外添加的信息。一个很常见的场景就是，后端有时候会将一些环境参数放到请求头里，如果不用这个字段来指定放行的字段，那么就会出现“跨域”限制了。

如果 OPTIONS 请求没有通过服务端的校验，就会返回一个正常的 HTTP 请求，不会带上 CORS 的返回信息，所以浏览器就会认定为“跨域”了。

**总结一句话就是，当 Console 报哪个错，你就在服务端返回头上加上哪个字段就可以了。**

### CORS 中间件

无论对于 Express 还是 KOA，我们都不需要再手动添加上面的字段了，直接加一个 `cors` 中间件就可以很方便地添加上面的字段，写起来也更优雅：

```js
var cors = require('cors');

var corsOptions = {
  origin: function (origin, callback) {
    // db.loadOrigins is an example call to load
    // a list of origins from a backing database
    db.loadOrigins(function (error, origins) {
      callback(error, origins)
    })
  }
}

app.use('/', cors(corsOptions), indexRouter);
```

## JSONP

那对于浏览器不支持 CORS 的情况呢？虽然目前来看是不太可能，但是在还没有 CORS 的时代，大家是怎么解决跨域的呢？答案就是 JSONP。

它的原理也非常简单：虽然浏览器限制了 HTTP 的跨域，但是没有限制获取 `script` 标签内容的跨域请求呀。

当我们插入一个 `<script src="xxx.com">` 标签的时候，会发一个获取 `xxx.com` 的 GET 请求，而这个 GET 请求又不存在“跨域”限制，通过这样的方法就能解决跨域的问题了。

服务端实现：

```js
router.get('/', (req, res) =>  {
  const { callback_name } = req.query;
  res.send(`${callback_name}('hello')`) // 返回 JS 代码，调用 callback_name 这个函数，并传入 hello
});
```

前端实现：

```js
function jsonpCallback(params) {
  alert('执行 public/index.html 里定义的 jsonpCallback 函数，并传入' + params + '参数');
}


const jsonp = async () => {
  // 制作 script 标签
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'http://localhost:9000/user?callback_name=jsonpCallback'
  // 添加标签
  document.body.appendChild(script);
  // 拿到数据再移除
  document.body.removeChild(script);
}

jsonp();
```

当调用 `jsonp` 函数的时候，自动创建一个 `script` 标签，再把请求放到 `scr` 里，就会自动发起 GET 请求。服务端会直接返回一串 JavaScript 代码，然后前端执行这段从服务端获取来的 JS 代码，获取到后端数据。


## 跨域场景

“跨域”不仅存在于接口访问，还会有以下场景：

* 前端访问跨域 URL，最常见的场景，需要后端添加 cors 的返回字段
* 微前端：主应用和子应用之间的资源访问可能存在“跨域”操作，需要子应用/主应用添加 cors
* 登录重定向：本质上和第一条一样，不过在现象层面不太一样。比如访问 abc.com 时，有的网站会重定向到自己的登录页 passport.abc.com，如果 passport.abc.com 没有设置 cors，也会出现跨域

## 总结

总的来说，我们常说的“跨域”，其实就是获取不同源（协议+域名+端口）的资源时，**浏览器自身** 做出的限制。

在以前，开发者会用 JSONP 这种通过生成一个 `script` 标签，自动发起 GET 请求的方式来解决跨域，但是这种方式非常不安全，不推荐。

到了现在，浏览器都已经完美支持 CORS 机制了，只需要在服务端添加对应的返回头 `Access-Control-xxx-yyy` 就可以了。当浏览器报“跨域”错误时，缺哪个字段，就在服务端配哪个字段即可。

Node 端开发时，我们可以直接使用 `cors` 中间件来配置，就不用手写返回头里的字段了。