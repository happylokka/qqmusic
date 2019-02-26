const path = require('path');

var express = require('express')
var axios = require('axios')
var app = express()
var apiRoutes = express.Router()
app.use('/api', apiRoutes)


function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // 选项...
  outputDir:'qqmusic',
  publicPath: '/',
  devServer: {
      port: 5000,
      open: true,
      before(app) {
        app.get('/api/getDiscList', function (req, res) {
          var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg' // 原api
          axios.get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          }).then((response) => {
            res.json(response.data)
          }).catch((e) => {
            console.log(e)
          })
        })

        app.get('/api/music', function(req, res){//获取vkey
          var url="https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg"
  
          axios.get(url, {
            headers: {  //通过node请求QQ接口，发送http请求时，修改referer和host
              referer: 'https://y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query //把前端传过来的params，全部给QQ的url
            }).then((response) => { 
                 res.json(response.data)
            }).catch((e) => {
                 console.log(e)
          })
        })

        app.get('/api/lyric', function(req, res){
          var url="https://szc.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg"
  
          axios.get(url, {
            headers: {  //通过node请求QQ接口，发送http请求时，修改referer和host
              referer: 'https://y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query //把前端传过来的params，全部给QQ的url
            }).then((response) => { 
                //  res.json(response.data)
                //将QQ返回的jsonp文件转换为json格式
                 var ret = response.data
                 if (typeof ret === 'string') {
                     var reg = /^\w+\(({[^()]+})\)$/
                     // 以单词a-z，A-Z开头，一个或多个
                     // \(\)转义括号以（）开头结尾
                     // （）是用来分组
                     // 【^()】不以左括号/右括号的字符+多个
                     // {}大括号也要匹配到
                     var matches = ret.match(reg)
                     if (matches) {
                         ret = JSON.parse(matches[1])
                         // 对匹配到的分组的内容进行转换
                     }
                }
                res.json(ret)
            }).catch((e) => {
                 console.log(e)
          })
        })
  
        app.get('/api/getSongList', function (req, res) {
          var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
          axios.get(url, {
            headers: {
              referer: 'https://y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          }).then((response) => {
            res.json(response.data)
          }).catch((e) => {
            console.log(e)
          })
        })
  
        app.get('/api/getSearch', function (req, res) {
          var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
          axios.get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          }).then((response) => {
            res.json(response.data)
          }).catch((e) => {
            console.log(e)
          })
        }) 
      }
  },
  assetsDir: './',
  lintOnSave: process.env.NODE_ENV !== 'production',
  chainWebpack: (config) => {
    config.resolve.alias
      .set('common',resolve('src/common'))
      .set('components',resolve('src/components'))
      .set('api',resolve('src/api'))
      .set('base',resolve('src/base'))
  }
}