import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const DocumentTitle = 'document-title'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getTitle() {
  return Cookies.get(DocumentTitle)
}

export function setTitle(title) {
  return Cookies.set(DocumentTitle, title)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
