export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = _.find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }
  // 判断数组或者对象
  const copy = Array.isArray(obj) ? [] : {}
  cache.push({
    original: obj,
    copy
  })
  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache) // 递归
  })

  return copy
}

/*
* 处理时间格式的主要函数库
* */
export function formatDate (time, fmt) {
  // time -> Number/String ,fmt -> String ,time:Number时间搓，String日期格式
  const date = typeof time === 'number' ? time * 1000 : time
  const timer = new Date(date)
  const o = {
    'M+': timer.getMonth() + 1, // 月份
    'd+': timer.getDate(), // 日
    'H+': timer.getHours(), // 小时
    'm+': timer.getMinutes(), // 分
    's+': timer.getSeconds(), // 秒
    'S+': timer.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (timer.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * forEach for object
 */
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}
