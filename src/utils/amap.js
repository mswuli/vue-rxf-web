export function RSAMAP() {
  const keyCode = '898f4d2e266c3b8611e7fc3db009b284'
  return new Promise(function(resolve, reject) {
    window.init = function() {
      resolve(window.AMap)
    }
    if (window.isLoadAMap) {
      window.init()
    } else {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = '//webapi.amap.com/maps?v=1.4.6&key=' + keyCode + '&plugin=AMap.DistrictSearch,AMap.Autocomplete&callback=init'
      script.onerror = reject
      document.head.appendChild(script)
      window.isLoadAMap = true
    }
  })
}
