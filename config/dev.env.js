'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

let params = process.argv[4]
let BASE_API_RXF = ''
let BASE_API_CRM = ''
let BASE_API_IMG = ''
let  BASE_API_IMG_TT = ''
let BASE_API_ATTACHMENT = ''

switch (params) {
  case '--env=dev':
    // dev环境域名配置，不可修改，不要用来调试。请使用local调试。启动命令 npm run dev
    BASE_API_RXF = '"http://dev.gateway.recloud.cn/rxf-web"'
    BASE_API_CRM = '"http://dev.gateway.recloud.cn/rxf-ucenter-web"'
    BASE_API_IMG = '"http://dev.images.recloud.cn"'
    BASE_API_IMG_TT = '"http://fat.dfs.recloud.cn"'
    BASE_API_ATTACHMENT = '"http://dev.attachments.recloud.cn"'
    break
  case '--env=fat':
    // fat环境域名配置，不可修改，不要用来调试。请使用local调试。启动命令 npm run fat
    BASE_API_RXF = '"http://fat.gateway.recloud.cn/rxf-web"'
    BASE_API_CRM = '"http://fat.gateway.recloud.cn/rxf-ucenter-web"'
    BASE_API_IMG = '"http://fat.images.recloud.cn"'
    BASE_API_IMG_TT = '"http://fat.dfs.recloud.cn"'
    BASE_API_ATTACHMENT = '"http://fat.attachments.recloud.cn"'
    break
  case '--env=pro':
    // pro环境域名配置，不可修改，不要用来调试。请使用local调试。启动命令 npm run pro
    BASE_API_RXF = '"http://gateway.recloud.cn/rxf-web"'
    BASE_API_CRM = '"http://gateway.recloud.cn/rxf-ucenter-web"'
    BASE_API_IMG = '"http://images.recloud.cn"'
    BASE_API_IMG_TT = '"http://fat.dfs.recloud.cn"'
    BASE_API_ATTACHMENT = '"http://attachments.recloud.cn"'
    break
  default :
    // 依据本地调试后台可以调整对应的ip等。启动命令 npm run start / npm run local
    BASE_API_RXF = '"http://dev.gateway.recloud.cn/rxf-web"'
    BASE_API_CRM = '"http://dev.gateway.recloud.cn/rxf-ucenter-web"'
    BASE_API_IMG = '"http://dev.images.recloud.cn"'
    BASE_API_IMG_TT = '"http://fat.dfs.recloud.cn"'
    BASE_API_ATTACHMENT = '"http://dev.attachments.recloud.cn"'
}

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API_RXF: BASE_API_RXF,
  BASE_API_CRM: BASE_API_CRM,
  BASE_API_IMG: BASE_API_IMG,
  BASE_API_IMG_TT:BASE_API_IMG_TT,
  BASE_API_ATTACHMENT: BASE_API_ATTACHMENT
})
