import moment from 'moment'

export function formatTime(value, type) {
  console.log(value)
  return '11'
}

export function yesOrNo(value, type) {
  if (value) {
    return '是'
  } else {
    return '否'
  }
}

export function moneyFormatter(value, type) {
  if (value == null || value === '' || value === 0 || value === '0') {
    return '0.00'
  } else {
    value = (value + '').replace(/[^0-9+-Ee.]/g, '')
    const decimals = 2
    const thousands_sep = ''
    const dec_point = '.'
    const n = !isFinite(+value) ? 0 : +value
    const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    const sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep
    const dec = (typeof dec_point === 'undefined') ? '.' : dec_point
    let s = ''
    const toFixedFix = (n, prec) => {
      const k = Math.pow(10, prec)
      return '' + Math.floor(n * k) / k
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.floor(n)).split('.')
    const re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
  }
}

export function dateFormat(value, type) {
  if (!value) {
    return ''
  }
  return moment(value).format('YYYY-MM-DD HH:mm:ss')
}

export function subStr(value) {
  if (!value) {
    return ''
  }
  return value.substr(0, 1) + '***'
}

export function  dateFilter(value,type){
  if(!value) {
    return ''
  }
  return moment(value).format('YYYY-MM-DD')
}

export function handoverTime(value,type){
  if(!value){
    return ''
  }
  return moment(value).format("HH:mm")
}
export function handoverEndTime(value,type){
  if(!value){
    return ''
  }
  return moment(value).format("HH:mm")
}

