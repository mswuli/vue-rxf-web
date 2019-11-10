'use strict'

let params = process.argv[2]
let BASE_API_RXF = ''
let BASE_API_CRM = ''
let BASE_API_IMG = ''
let  BASE_API_IMG_TT = ''
let BASE_API_ATTACHMENT = ''

switch (params) {
  // dev环境域名配置，不可修改，不要用来调试。请使用dev.env.js的local调试。启动命令 npm run build dev
  case 'dev':
    BASE_API_RXF = '"http://dev.gateway.recloud.cn/rxf-web"'
    BASE_API_CRM = '"http://dev.gateway.recloud.cn/rxf-ucenter-web"'
    BASE_API_IMG = '"http://dev.images.recloud.cn"'
    BASE_API_IMG_TT = '"http://fat.dfs.recloud.cn"'
    BASE_API_ATTACHMENT = '"http://dev.attachments.recloud.cn"'
    break
  case 'fat':
    // fat环境域名配置，不可修改，不要用来调试。请使用dev.env.js的local调试。启动命令 npm run build fat
    BASE_API_RXF = '"http://fat.gateway.recloud.cn/rxf-web"'
    BASE_API_CRM = '"http://fat.gateway.recloud.cn/rxf-ucenter-web"'
    BASE_API_IMG = '"http://fat.images.recloud.cn"'
    BASE_API_IMG_TT = '"http://fat.dfs.recloud.cn"'
    BASE_API_ATTACHMENT = '"http://fat.attachments.recloud.cn"'
    break
  case 'pro':
    // pro环境域名配置，不可修改，不要用来调试。请使用dev.env.js的local调试。启动命令 npm run build pro
    BASE_API_RXF = '"http://gateway.recloud.cn/rxf-web"'
    BASE_API_CRM = '"http://gateway.recloud.cn/rxf-ucenter-web"'
    BASE_API_IMG = '"http://images.recloud.cn"'
    BASE_API_IMG_TT = '"http://fat.dfs.recloud.cn"'
    BASE_API_ATTACHMENT = '"http://attachments.recloud.cn"'
    break
  default:
    BASE_API_RXF = '"http://dev.gateway.recloud.cn/rxf-web"'
    BASE_API_CRM = '"http://dev.gateway.recloud.cn/rxf-ucenter-web"'
    BASE_API_IMG = '"http://dev.images.recloud.cn"'
    BASE_API_IMG_TT = '"http://fat.dfs.recloud.cn"'
    BASE_API_ATTACHMENT = '"http://dev.attachments.recloud.cn"'
}

module.exports = {
  NODE_ENV: '"production"',
  BASE_API_RXF: BASE_API_RXF,
  BASE_API_CRM: BASE_API_CRM,
  BASE_API_IMG: BASE_API_IMG,
  BASE_API_IMG_TT: BASE_API_IMG_TT,
  BASE_API_ATTACHMENT: BASE_API_ATTACHMENT
}

