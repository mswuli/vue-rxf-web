import axios from 'axios'
import {
  Message,
  MessageBox,
  Loading
} from 'element-ui'
import store from '../store'
import {
  getToken
} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API_RXF, // api的base_url
  timeout: 30000 // 请求超时时间
})

let loading
// request拦截器
service.interceptors.request.use(config => {
  if (['post', 'put'].indexOf(config.method) !== -1) {
    loading = Loading.service({
      fullscreen: true
    })
  }
  if (['get'].indexOf(config.method) !== -1) {
    if (config.params && config.params.params && config.params.params.searchCondition) {
      const params = config.params.params.searchCondition
      const ks = Object.keys(params);//枚举自身属性
      for (const k of ks) {
        // console.log(k)
        if (params[k] === '') {
          params[k] = null
        }
      }
    }
  }
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // if (!config.isJSON) {
  //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  //   config.headers['x-request-with'] = 'XMLHttpRequest'
  //   config.transformRequest = function (obj) {
  //     const str = []
  //     for (const p in obj) {
  //       str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
  //     }
  //     return str.join('&')
  //   }
  // } else {
  //   config.headers['Content-Type'] = 'application/json;charset=UTF-8'
  // }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data
    loading && loading.close()
    if (res && (res === 'SUCCESS' || 'success' in res && res.success !== true)) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(res)
    }
    return res
    // if (res && (res === 'SUCCESS' || 'success' in res && res.success !== true)) {
    //   Message({
    //     message: res.msg,
    //     type: 'error',
    //     duration: 3 * 1000
    //   })

    //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //   // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //   //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //   //     confirmButtonText: '重新登录',
    //   //     cancelButtonText: '取消',
    //   //     type: 'warning'
    //   //   }).then(() => {
    //   //     store.dispatch('FedLogOut').then(() => {
    //   //       location.reload()// 为了重新实例化vue-router对象 避免bug
    //   //     })
    //   //   })
    //   // }
    //   return Promise.reject('error')
    // } else {
    //   return response.data
    // }
  },
  error => {
    console.log('err' + error) // for debug
    loading && loading.close()
    if (error.response == null) {
      Message({
        message: '网络错误：' + error,
        type: 'error',
        duration: 3 * 1000
      })
    } else {
      if (error.response.status === 401) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: '网络错误：' + error.response.status,
          type: 'error',
          duration: 3 * 1000
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
