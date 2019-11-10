import { getToken } from '@/utils/auth'

export function download(url, params, fileName) {
  const xhh = new XMLHttpRequest()
  xhh.open('GET', process.env.BASE_API_RXF + url + '?params=' + encodeURI(JSON.stringify(params)))
  xhh.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhh.setRequestHeader('Authorization', getToken())
  xhh.responseType = 'blob'
  xhh.onreadystatechange = function() {
    if (xhh.readyState === 4 && xhh.status === 200) {
      let name = xhh.getResponseHeader('Content-disposition')
      name = fileName + '.xlsx'
      const mimeType = xhh.getResponseHeader('ajax-mimeType')
      const blob = new Blob([xhh.response], { type: mimeType })
      const csvUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = csvUrl
      link.download = name
      link.click()
    }
  }
  xhh.send()
}
