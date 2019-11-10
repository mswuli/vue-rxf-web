import request from '@/utils/request'

export function login(username, password, source) {
	console.log(username, password, source)
  return request({
    url: '/security/login',
    method: 'post',
    data: {
      username,
      password,
      source
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/security/logout',
    method: 'put'
  })
}
