import { Message } from 'element-ui'
// 中心处理函数
export default function (key) {
  // 这里对数据进行处理，返回一个 Promise
  return import(`./config/${key}.js`).then(func => {
    return Promise.resolve(func.default())
  }).catch(e => {
    if (e.code === 'MODULE_NOT_FOUND') {
      Message.error(`无法找在dataCenter文件夹下面找到${key}.js文件`)
      // 筛选数据还可以在这里通过报表id 去请求接口
    } else {
      Message.error(`请检查${key}.js文件书写是否正确`)
    }
  })
}
